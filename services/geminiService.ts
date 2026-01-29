import { GoogleGenAI, Type } from "@google/genai";
import { AIResponseItem } from '../types';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateTaskBreakdown = async (goal: string): Promise<AIResponseItem[]> => {
  if (!apiKey) {
    console.warn("API Key is missing. Returning mock data or empty.");
    return [];
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Break down the following goal into a stack of actionable, small todo items. 
      For each item, estimate a time duration in minutes (keep it under 60 minutes for focus).
      Goal: "${goal}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              task: { type: Type.STRING },
              estimatedMinutes: { type: Type.NUMBER },
            },
            required: ["task", "estimatedMinutes"],
          },
        },
      },
    });

    if (response.text) {
      const data = JSON.parse(response.text) as AIResponseItem[];
      return data;
    }
    return [];
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
