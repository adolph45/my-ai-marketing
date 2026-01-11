
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
  // 檢查 API Key 是否存在於環境變數中
  // 在 Vite/Vercel 環境中，process.env.API_KEY 必須在編譯時注入
  const apiKey = process.env.API_KEY;

  if (!apiKey || apiKey === '' || apiKey === 'undefined') {
    console.error("DEBUG: API_KEY is missing in process.env");
    throw new Error("環境變數中找不到 API_KEY。請檢查 Vercel 專案設定中的 Environment Variables 是否已添加名為 'API_KEY' 的項目，並確保該變數已生效。");
  }

  const ai = new GoogleGenAI({ apiKey: apiKey });
  const startDate = getNextMonday();
  
  const systemInstruction = `你是一位世界級的行銷策略專家。
你的任務是根據用戶輸入的資訊，生成一份為期 12 週的社群媒體行銷計畫。
必須嚴格以 JSON 格式回傳。`;

  const prompt = `產業：${input.industry}
品牌：${input.brandName}
目標：${input.marketingGoal}
客群：${input.audience}
聯絡資訊：${input.contactInfo}
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
                        platform: { type: Type.STRING },
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
                required: ["weekNumber", "startDate"]
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
    console.error("Gemini API Error Detail:", error);
    // 拋出更具體的錯誤
    if (error.message?.includes("API_KEY_INVALID")) {
      throw new Error("API Key 無效，請檢查 Key 是否正確複製。");
    }
    throw new Error(error.message || "生成計畫時發生未知錯誤");
  }
};

export const generatePostImage = async (prompt: string): Promise<string> => {
  const apiKey = process.env.API_KEY || '';
  const ai = new GoogleGenAI({ apiKey: apiKey });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `High-quality commercial photography, ${prompt}` }],
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
