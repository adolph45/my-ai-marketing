
import { GoogleGenAI, Type } from "@google/genai";
import { MarketingInput, MarketingPlan } from "../types";

export const generateMarketingPlan = async (input: MarketingInput): Promise<MarketingPlan> => {
  const apiKey = process.env.API_KEY;

  if (!apiKey || apiKey === '' || apiKey === 'undefined') {
    throw new Error("系統 API_KEY 尚未配置，請聯繫管理員。");
  }

  const ai = new GoogleGenAI({ apiKey: apiKey });
  
  const systemInstruction = `請扮演一位世界級的行銷策略專家與文案大師。
【核心邏輯框架】
基於 JTBD 任務理論、ODI 成果驅動創新、西奧多·李維特觀點（關注結果而非產品）與馬斯洛需求理論進行策略與第一性原理規劃。

【內容產出規則】
- 第一週【準備週】：
  * 人物誌洞察 (Persona)：請建立一份「人物誌洞察表格」（使用 Markdown 表格語法格式化於字串中），包含用戶的背景、核心目標、預期成果、遇到的阻礙與心理需求。總篇幅需達 300 字深度分析。
  * 品牌定位策略：請撰寫至少 300 字的定位策略，說明如何滿足上述受眾的需求。
  * 全部內容必須使用「繁體中文」撰寫。
  * 內容中【絕對嚴禁】出現理論名稱，如「JTBD」、「ODI」、「馬斯洛」、「奶昔案例」、「安東尼·烏爾威克」、「西奧多·李維特」等文字。請將理論內化為淺顯易懂的商業建議。
- 第二至十二週【貼文週】：
  * 每週包含 1 篇 Facebook (約 300字) 與 1 篇 Instagram (約 150字)。
  * 視覺風格：${input.style}。
  * 貼文需包含日期與星期幾。計畫起點為最近的下一個週一。
  * 每篇貼文末尾必須自動帶入聯絡資訊 CTA：\n${input.contactInfo}。
- 蒐集最近 3 年台灣（比重 70%）的相關行銷案例與法令訊息進行規劃。`;

  const prompt = `
【行銷參數】
產業：${input.industry}
創意風格：${input.style}
受眾：${input.audience}
目標：${input.marketingGoal}
重點：${input.strategyFocus}
參考對象：${input.targetBrandName || '同行領先者'} (${input.targetBrandUrl || '無'}), ${input.favoriteCreatorName || '風格創作者'} (${input.favoriteCreatorUrl || '無'})

請直接生成完整的 12 週 JSON 計畫，確保第一週包含詳細的表格化人物誌與品牌定位。`;

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
                      persona: { type: Type.STRING, description: "包含 Markdown 表格的人物誌洞察" },
                      brandPositioning: { type: Type.STRING, description: "品牌價值與定位策略" }
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
        parts: [{ text: `Professional commercial photography, social media ad visual, 4k, ${prompt}` }],
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
    throw new Error(error.message || "圖片生成發生錯誤。");
  }
};
