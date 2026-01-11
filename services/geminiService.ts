
import { GoogleGenAI, Type } from "@google/genai";
import { MarketingInput, MarketingPlan } from "../types";

export const generateMarketingPlan = async (input: MarketingInput): Promise<MarketingPlan> => {
  const apiKey = process.env.API_KEY;

  if (!apiKey || apiKey === '' || apiKey === 'undefined') {
    throw new Error("API_KEY 缺失，請確保已在環境變數或透過金鑰選取對話框設定金鑰。");
  }

  const ai = new GoogleGenAI({ apiKey: apiKey });
  
  const systemInstruction = `你是一位世界級的行銷策略專家與文案大師。
【核心邏輯框架】
1. JTBD 任務理論：專注於用戶想達成的「進展」。
2. ODI 成果驅動創新：專注於用戶期待的成果。
3. 西奧多·李維特觀點：人們想要的是「孔」而非「鑽頭」。
4. 馬斯洛需求理論：對應心理需求層次。

【內容產出規則】
- 第一週【準備週】：
  * 人物誌洞察 (Persona)：請根據 JTBD 框架撰寫至少 300 字的深度分析。
  * 品牌定位策略：請根據 ODI 與馬斯洛理論撰寫至少 300 字的策略。
  * 全部內容必須使用「繁體中文」撰寫。
  * 內容中嚴禁出現「JTBD」、「ODI」、「馬斯洛」、「鑽頭理論」等學術專有名詞。
- 第二至十二週【貼文週】：
  * 每週 1 篇 Facebook (300字) 與 1 篇 Instagram (150字)。
  * 風格必須符合：${input.style}。
  * 每篇貼文末尾必須包含聯絡資訊 CTA：\n${input.contactInfo}。
- 根據最近 3 年台灣行銷案例與法令進行規劃。`;

  const prompt = `
【行銷參數】
產業：${input.industry}
受眾：${input.audience}
目標：${input.marketingGoal}
重點：${input.strategyFocus}
參考品牌：${input.targetBrandName} (${input.targetBrandUrl})
參考帳號：${input.favoriteCreatorName} (${input.favoriteCreatorUrl})

請直接生成完整的 12 週 JSON 計畫。`;

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
                        platform: { type: Type.STRING, enum: ["FB", "IG"] },
                        content: { type: Type.STRING },
                        imagePrompt: { type: Type.STRING },
                        hashtags: { type: Type.ARRAY, items: { type: Type.STRING } }
                      },
                      required: ["platform", "content", "imagePrompt", "hashtags"]
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
    throw error;
  }
};

export const generatePostImage = async (prompt: string): Promise<string> => {
  const apiKey = process.env.API_KEY;
  const ai = new GoogleGenAI({ apiKey: apiKey });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{ text: `Social media advertising visual, high-quality photography, ${prompt}` }],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
          imageSize: "1K"
        }
      }
    });

    if (!response.candidates?.[0]?.content?.parts) throw new Error("無效的 API 回傳");

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("找不到圖片數據");
  } catch (error: any) {
    console.error("Image Gen Error:", error);
    if (error.message?.includes("429") || error.message?.includes("quota")) {
      throw new Error("配額限制：目前的 API Key 可能沒有圖片生成配額。請嘗試選取具備付費專案的 Key。");
    }
    throw error;
  }
};
