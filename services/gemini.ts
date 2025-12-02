import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { UrgencyLevel } from "../types";
import { classifyUrgencyHeuristic } from "./heuristicClassifier";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || process.env.API_KEY || '';
const ai = new GoogleGenerativeAI(API_KEY);

const MODEL_NAME = "gemini-1.5-flash";

export const geminiService = {
  async classifyUrgency(needs: string, location: string): Promise<{ urgency: UrgencyLevel; reasoning: string }> {
    try {
      const prompt = `
        Analyze the following crisis submission.
        Needs: "${needs}"
        Location: "${location}"
        
        Classify the urgency as CRITICAL, MODERATE, or LOW.
        CRITICAL: Life-threatening, immediate medical need, trapped, fire, flood imminent.
        MODERATE: Food, water, shelter needed but not immediately life-threatening.
        LOW: Information request, long-term support, non-urgent supplies.
        
        Provide a very short reasoning (max 10 words).
      `;

      const model = ai.getGenerativeModel({
        model: MODEL_NAME,
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: SchemaType.OBJECT,
            properties: {
              urgency: {
                type: SchemaType.STRING,
                enum: ["CRITICAL", "MODERATE", "LOW"]
              },
              reasoning: {
                type: SchemaType.STRING
              }
            }
          }
        }
      });

      const response = await model.generateContent(prompt);
      const jsonStr = response.response.text();
      if (!jsonStr) throw new Error("No response from AI");

      const result = JSON.parse(jsonStr);
      return {
        urgency: result.urgency as UrgencyLevel,
        reasoning: result.reasoning
      };

    } catch (error) {
      console.error("Gemini classification failed, using heuristic fallback:", error);
      // Fallback to heuristic classification
      return classifyUrgencyHeuristic(needs, location);
    }
  }
};