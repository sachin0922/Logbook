
import { GoogleGenAI, Type } from "@google/genai";
import { LogEntry } from "../types";

export const analyzeLogs = async (logs: LogEntry[]) => {
  // Always use the recommended initialization pattern with direct access to process.env.API_KEY
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Analyze these engineering test rig logs and provide a summary of status, anomalies found, and engineering recommendations.
  Logs: ${JSON.stringify(logs)}`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          anomalies: { type: Type.ARRAY, items: { type: Type.STRING } },
          recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["summary", "anomalies", "recommendations"],
      },
    },
  });

  // response.text is a property, not a method. Use trim() to clean output before parsing.
  return JSON.parse(response.text?.trim() || '{}');
};

export const extractLogFromAudioTranscription = async (transcription: string) => {
  // Always use the recommended initialization pattern with direct access to process.env.API_KEY
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Extract a structured log entry from this engineer's verbal report: "${transcription}". Identify the unit, phase, observations, and severity.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          content: { type: Type.STRING },
          severity: { type: Type.STRING },
          unitId: { type: Type.STRING },
          phase: { type: Type.STRING },
          tags: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["content", "severity", "unitId", "phase", "tags"],
      },
    },
  });

  // response.text is a property, not a method. Use trim() to clean output before parsing.
  return JSON.parse(response.text?.trim() || '{}');
};
