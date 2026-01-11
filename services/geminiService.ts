
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
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const startDate = getNextMonday();
  
  const systemInstruction = `你是一位世界級的行銷策略專家，精通 JTBD (Jobs-To-Be-Done)、ODI (Outcome-Driven Innovation)、及馬斯洛需求層次理論。
你的任務是根據用戶輸入的資訊，為其品牌「${input.brandName}」生成一份為期 12 週的社群媒體行銷計畫（FB與IG）。

嚴格執行規範：
1. **產業深度研究**：深入研究「${input.industry}」在台灣的行銷趨勢。
   - 如果是批發業（B2B），請聚焦於「信任感」、「品質穩定性」、「供應鏈優勢」與「長期合作價值」。
   - 務必自行搜尋台灣社群媒體中此行業最具代表性的高成效帳號作為內容參考。
2. **理論框架應用**：輸出中禁止提及理論名稱，但邏輯必須體現客戶完成任務的核心需求。
3. **計畫內容**：
   - 第1週：準備週（日期自 ${startDate} 開始），包含詳細的人物誌 (Persona) 與品牌定位。
   - 第2-13週：每週包含 1 篇 FB 貼文與 1 篇 IG 貼文。
   - 文案需自然融入品牌名稱「${input.brandName}」。
   - 每篇貼文需包含精確的「圖片生成指令」，風格鎖定「${input.style}」。
4. **輸出格式**：必須以純 JSON 格式回傳。
5. **日期計算**：計畫起點日期為 ${startDate}，依序遞增。
`;

  const prompt = `請為從事「${input.industry}」且品牌名稱為「${input.brandName}」的企業生成行銷計畫。
主要客群：${input.audience}。
起點日期：${startDate}。
行銷目標：${input.marketingGoal}。
策略重心：${input.strategyFocus}。
參考資訊：${input.targetBrandName || "請搜尋頂尖品牌"} ${input.targetBrandUrl || ""}。
創作者參考：${input.favoriteCreatorName || "請搜尋高流量帳號"} ${input.favoriteCreatorUrl || ""}。
聯絡資訊（請務必放入文案結尾）：${input.contactInfo}。
`;

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
};

export const generatePostImage = async (prompt: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          text: `Professional product/business advertising photography: ${prompt}`,
        },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1",
      },
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("Failed to generate image");
};
