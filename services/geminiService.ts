
import { GoogleGenAI, Type } from "@google/genai";
import { MarketingInput, MarketingPlan } from "../types";

export const generateMarketingPlan = async (input: MarketingInput): Promise<MarketingPlan> => {
  const apiKey = process.env.API_KEY;

  if (!apiKey || apiKey === '' || apiKey === 'undefined') {
    throw new Error("環境變數中找不到 API_KEY。請檢查 Vercel 專案設定中的 Environment Variables 是否已添加名為 'API_KEY' 的項目。");
  }

  const ai = new GoogleGenAI({ apiKey: apiKey });
  
  const systemInstruction = `你是一位世界級的行銷策略專家與文案大師。你的思考邏輯基於以下框架：
1. JTBD (Jobs-to-be-Done) 任務理論：參考《創新的用途理論》(Competing Against Luck) 與鮑伯·莫斯塔 (Bob Moesta) 的「奶昔案例」，關注用戶想達成的「進展」而非產品本身。
2. 成果驅動創新 (ODI)：參考安東尼·烏爾威克 (Anthony Ulwick) 的流程，專注於用戶期待的成果。
3. 西奧多·李維特觀點：人們不是要買鑽頭，而是想要一個孔。
4. 馬斯洛需求理論：分析受眾心理層次。

請根據用戶輸入，生成 12 週的社群計畫。

內容產出規則：
- 第一週為【準備週】：
  * 人物誌洞察 (Persona)：基於 JTBD 框架，撰寫約 300 字的深度受眾解析（繁體中文）。
  * 品牌定位策略：基於 ODI 與馬斯洛理論，撰寫約 300 字的品牌價值定位（繁體中文）。
- 第二至十二週為【貼文週】：
  * 每週包含 1 篇 Facebook 貼文（約 300 字）與 1 篇 Instagram 貼文（約 150 字）。
  * 必須包含圖片生成描述 (Image Prompt)，描述需符合風格「${input.style}」。
  * 每篇貼文最後必須包含聯絡資訊 CTA：${input.contactInfo}。
  * 嚴禁在計畫中出現理論名稱（如 JTBD, ODI 等文字）。
- 語氣需根據戰略目標「${input.marketingGoal}」調整。
- 蒐集最近 3 年台灣相關行業的成功案例與法律訊息進行解析。`;

  const prompt = `
【輸入資料】
產業類型：${input.industry}
品牌名稱：${input.brandName}
風格：${input.style}
主要受眾：${input.audience}
戰略目標：${input.marketingGoal}
核心重點：${input.strategyFocus}
參考品牌/創作者：${input.targetBrandName} (${input.targetBrandUrl}), ${input.favoriteCreatorName} (${input.favoriteCreatorUrl})
聯絡資訊：${input.contactInfo}

請一次完成 12 週的計畫。第一週呈現人物誌與定位，第二週起呈現 FB/IG 貼文。`;

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
                      persona: { type: Type.STRING, description: "約 300 字的人務誌分析" },
                      brandPositioning: { type: Type.STRING, description: "約 300 字的定位策略" }
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
    throw new Error(error.message || "生成計畫時發生錯誤");
  }
};

export const generatePostImage = async (prompt: string): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API_KEY 缺失");
  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] }
    });
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
    throw new Error("圖片數據缺失");
  } catch (error: any) {
    throw error;
  }
};
