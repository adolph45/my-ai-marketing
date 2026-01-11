
import { GoogleGenAI, Type } from "@google/genai";
import { MarketingInput, MarketingPlan } from "../types";

const getNextMonday = (): string => {
  const d = new Date();
  const day = d.getDay();
  const diff = (1 + 7 - day) % 7 || 7;
  d.setDate(d.getDate() + diff);
  return d.toISOString().split('T')[0];
};

export const generateMarketingPlan = async (input: MarketingInput): Promise<MarketingPlan> => {
  const apiKey = process.env.API_KEY;

  if (!apiKey || apiKey === '' || apiKey === 'undefined') {
    throw new Error("環境變數中找不到 API_KEY。請檢查 Vercel 專案設定中的 Environment Variables 是否已添加名為 'API_KEY' 的項目，並確保該變數已生效。");
  }

  const ai = new GoogleGenAI({ apiKey: apiKey });
  
  const systemInstruction = `你是一位世界級的行銷文案專家與社群經營者。
你的任務是根據用戶輸入，生成 12 週的社群媒體計畫。

內容規範：
1. 每週必須包含 Facebook 與 Instagram 的貼文內容。
2. Facebook 貼文內容：長度約為 300 字，語氣應包含專業見解、故事性或詳細說明。
3. Instagram 貼文內容：長度約為 150 字，語氣應更感性、活潑、簡短，並強調視覺描述。
4. 必須嚴格以 JSON 格式回傳。`;

  const prompt = `
產業：${input.industry}
品牌名稱：${input.brandName}
風格：${input.style}
主要受眾：${input.audience}
目標：${input.marketingGoal}
核心重點：${input.strategyFocus}
聯絡資訊：${input.contactInfo}

請為我規劃 12 週的貼文，每週請提供 2-3 則貼文內容。
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            weeks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  weekNumber: { type: Type.INTEGER },
                  startDate: { type: Type.STRING },
                  prepPhase: {
                    type: Type.OBJECT,
                    properties: {
                      persona: { type: Type.STRING },
                      brandPositioning: { type: Type.STRING }
                    }
                  },
                  posts: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        date: { type: Type.STRING },
                        dayOfWeek: { type: Type.STRING },
                        platform: { type: Type.STRING, enum: ["FB", "IG"] },
                        content: { type: Type.STRING },
                        imagePrompt: { type: Type.STRING },
                        hashtags: {
                          type: Type.ARRAY,
                          items: { type: Type.STRING }
                        }
                      },
                      required: ["date", "dayOfWeek", "platform", "content", "imagePrompt", "hashtags"]
                    }
                  }
                },
                required: ["weekNumber", "startDate", "posts"]
              }
            }
          },
          required: ["weeks"]
        }
      }
    });

    if (!response.text) {
      throw new Error("AI 回傳了空的結果。");
    }

    const rawData = JSON.parse(response.text);
    
    return {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      input,
      weeks: rawData.weeks.map((w: any) => ({
        ...w,
        posts: w.posts?.map((p: any) => ({ ...p, isCompleted: false })) || []
      }))
    };
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "生成計畫時發生錯誤");
  }
};

export const generatePostImage = async (prompt: string): Promise<string> => {
  const apiKey = process.env.API_KEY || '';
  const ai = new GoogleGenAI({ apiKey: apiKey });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `High-quality commercial photography for marketing, ${prompt}` }],
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("無法獲取圖片。");
  } catch (error: any) {
    throw error;
  }
};
