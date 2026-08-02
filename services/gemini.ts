import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { UrgencyLevel } from "../types";
import { classifyUrgencyHeuristic } from "./heuristicClassifier";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || process.env.API_KEY || '';
const ai = new GoogleGenerativeAI(API_KEY);

const MODEL_NAMES = ["gemini-2.5-flash", "gemini-1.5-flash", "gemini-2.0-flash"];

function parseImagePart(dataUrl: string) {
  try {
    const match = dataUrl.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
    if (match) {
      return {
        inlineData: {
          mimeType: match[1],
          data: match[2],
        },
      };
    }
  } catch (e) {
    console.warn("Failed to parse image for AI classification", e);
  }
  return null;
}

export const geminiService = {
  async classifyUrgency(
    needs: string,
    location: string,
    images?: string[]
  ): Promise<{ urgency: UrgencyLevel; reasoning: string }> {
    if (!API_KEY) {
      return classifyUrgencyHeuristic(needs, location);
    }

    const imageParts = (images || [])
      .map(parseImagePart)
      .filter((p): p is { inlineData: { mimeType: string; data: string } } => p !== null);

    const hasImages = imageParts.length > 0;

    const prompt = `
      Analyze the following crisis submission ${hasImages ? 'and attached photos' : ''}.
      Needs: "${needs}"
      Location: "${location}"
      ${hasImages ? `Attached photos: ${imageParts.length} photo(s)` : ''}

      Classify the urgency as CRITICAL, MODERATE, or LOW based on both text and visual evidence.
      CRITICAL: Life-threatening, severe injury, active fire, collapse, rising floodwaters, trapped individuals.
      MODERATE: Food, clean water, temporary shelter needed, non-life-threatening injury, power outage support.
      LOW: General inquiries, long-term relief request, non-urgent supplies.

      Provide a concise reasoning (max 12 words).
    `;

    for (const modelName of MODEL_NAMES) {
      try {
        const model = ai.getGenerativeModel({
          model: modelName,
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

        const contents: any[] = [prompt, ...imageParts];
        const response = await model.generateContent(contents);
        const jsonStr = response.response.text();
        if (!jsonStr) continue;

        const result = JSON.parse(jsonStr);
        return {
          urgency: result.urgency as UrgencyLevel,
          reasoning: result.reasoning
        };

      } catch (error) {
        console.warn(`Gemini model ${modelName} classification failed:`, error);
        // Try next fallback model
      }
    }

    // Fallback to heuristic classification if all AI calls fail
    return classifyUrgencyHeuristic(needs, location);
  }
};