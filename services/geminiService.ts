
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
  // 檢查 API Key 是否存在
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === '') {
    throw new Error("找不到 API Key。請確保您已在 Vercel 設定環境變數 API_KEY。");
  }

  const ai = new GoogleGenAI({ apiKey: apiKey });
  const startDate = getNextMonday();
  
  const systemInstruction = `你是一位世界級的行銷策略專家，精通 JTBD (Jobs-To-Be-Done) 與 ODI (Outcome-Driven Innovation)。
你的任務是根據用戶輸入的資訊，為其品牌「${input.brandName}」生成一份為期 12 週的社群媒體行銷計畫（FB與IG）。

嚴格執行規範：
1. **計畫內容**：
   - 第1週：準備週（日期自 ${startDate} 開始），包含詳細的人物誌 (Persona) 與品牌定位。
   - 第2-13週：每週包含 1 篇 FB 貼文與 1 篇 IG 貼文。
   - 每篇貼文需包含精確的「圖片生成指令」，風格鎖定「${input.style}」。
2. **輸出格式**：必須以純 JSON 格式回傳。
`;

  const prompt = `請為從事「${input.industry}」且品牌名稱為「${input.brandName}」的企業生成行銷計畫。
主要客群：${input.audience}。
行銷目標：${input.marketingGoal}。
策略重心：${input.strategyFocus}。
聯絡資訊：${input.contactInfo}。
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", // 改用更穩定且免費額度較高的 Flash 型號
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
    throw new Error(error.message || "生成計畫時發生未知錯誤");
  }
};

export const generatePostImage = async (prompt: string): Promise<string> => {
  const apiKey = process.env.API_KEY;
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
    throw new Error("無法從模型獲取圖片數據");
  } catch (error: any) {
    console.error("Image Generation Error:", error);
    throw error;
  }
};
