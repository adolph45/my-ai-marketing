
import { GoogleGenAI, Type } from "@google/genai";
import { MarketingInput, MarketingPlan } from "../types";

/**
 * Generates a comprehensive 12-week marketing plan using Gemini 3 Pro.
 * Adheres to guidelines for complex reasoning tasks and specific business frameworks.
 */
export const generateMarketingPlan = async (input: MarketingInput): Promise<MarketingPlan> => {
  // Always use provided API Key from environment
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `你是一位世界級的社群行銷策略家。
【任務程序】
1. 深入研究「${input.industry}」領域過去 3 年內的行銷議題與成功案例。
2. 比重分配：70% 必須來自「台灣地區」的案例與社群帳號，30% 為國際案例。
3. 法令合規：嚴格考量台灣相關法律規範進行規劃。

【核心理論內化（嚴禁在輸出中提及理論名稱）】
- JTBD (Jobs-to-be-Done)：關注用戶要達成的「結果」而非產品規格（參考《創新的用途理論》、HBR 奶昔案例、西奧多·李維特鑽孔理論）。
- ODI (Outcome-Driven Innovation)：以成果為驅動的創新流程。
- 馬斯洛需求理論：定位受眾的心理需求層級。

【內容產出規則】
- 第一週【準備週】：
  * 建立一份「深度人物誌洞察表格」(Persona)，包含背景、核心目標、預期成果、阻礙、心理需求。
  * 品牌價值定位策略。
- 第二至十二週【貼文週】：
  * 每週 1 篇 FB (300字) + 1 篇 IG (150字)。
  * 風格：${input.style}。
  * 計畫起點為最近的下一個週一，需標註日期與星期幾。
  * 每一篇貼文末尾必須包含 CTA 資訊：\n${input.contactInfo}。
- 全部內容必須使用「繁體中文」撰寫。
- 【絕對禁令】：不可出現「JTBD」、「ODI」、「馬斯洛」、「奶昔案例」、「安東尼·烏爾威克」、「鑽孔理論」等理論文字。請將其內化為專業的商業建議。`;

  const prompt = `
【行銷參數設定】
- 產業類型：${input.industry}
- 創意風格：${input.style}
- 主要受眾：${input.audience}
- 戰略目標：${input.marketingGoal}
- 核心重點：${input.strategyFocus}
- 對標品牌/帳號：${input.targetBrandName || '自動蒐集業內領先者'} (${input.targetBrandUrl || ''})
- 喜愛的創作者：${input.favoriteCreatorName || '自動蒐集相關風格創作者'} (${input.favoriteCreatorUrl || ''})

請根據以上參數，運用 JTBD 與 ODI 的核心邏輯，為我打造一份為期 12 週的行銷計畫。`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
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
                      persona: { type: Type.STRING, description: "Markdown 格式的人物誌分析表格" },
                      brandPositioning: { type: Type.STRING, description: "品牌定位與價值觀建議" }
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

    const rawData = JSON.parse(response.text || '{}');
    return {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      input,
      weeks: (rawData.weeks || []).map((w: any) => ({
        ...w,
        posts: w.posts?.map((p: any) => ({ ...p, isCompleted: false })) || []
      }))
    };
  } catch (error: any) {
    throw error;
  }
};

/**
 * Generates an image using gemini-2.5-flash-image.
 */
export const generatePostImage = async (prompt: string): Promise<string> => {
  // Freshly initialize inside the function to ensure current context's API KEY is used
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `High quality professional social media visual, commercial photography style, ${prompt}` }],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    if (!response.candidates?.[0]?.content?.parts) {
      throw new Error("API 回傳內容不完整。");
    }

    const parts = response.candidates[0].content.parts;
    for (const part of parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    
    throw new Error("模型未回傳任何圖片數據，請嘗試更換提示詞。");
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    // Specifically identifying permission issues
    if (error.message?.toLowerCase().includes("permission") || error.message?.toLowerCase().includes("forbidden")) {
      throw new Error("API 金鑰權限不足：請確保您的 Google Cloud 專案已開啟 Imagen 或實驗性模型服務。");
    }
    throw new Error(error.message || "影像生成失敗，請稍後再試。");
  }
};
