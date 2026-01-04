import { GoogleGenAI } from "@google/genai";
import { BackgroundOption, ProcessingConfig } from "../types";

const getPromptForOption = (config: ProcessingConfig): string => {
  const basePrompt = "Edit this image. Isolate the main subject precisely.";
  
  switch (config.option) {
    case BackgroundOption.WHITE:
      return `${basePrompt} Place the subject on a pure, flat white background (#FFFFFF). Ensure edges are clean and sharp.`;
    case BackgroundOption.GREEN_SCREEN:
      return `${basePrompt} Place the subject on a pure chroma green background (#00FF00) suitable for chroma keying.`;
    case BackgroundOption.TRANSPARENT:
      return `${basePrompt} Remove the background completely. Return the image with a transparent background (alpha channel).`;
    case BackgroundOption.STUDIO:
      return `${basePrompt} Place the subject in a professional photo studio environment with soft lighting and a neutral grey background.`;
    case BackgroundOption.CITY:
      return `${basePrompt} Place the subject in a blurred modern city street background with bokeh effect.`;
    case BackgroundOption.NATURE:
      return `${basePrompt} Place the subject in a serene nature landscape with soft sunlight.`;
    default:
      return `${basePrompt} ${config.customPrompt || "Remove the background."}`;
  }
};

export const processImage = async (
  base64Image: string, 
  mimeType: string, 
  config: ProcessingConfig
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = getPromptForOption(config);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', // Switched to Flash Image (Free tier friendly)
      contents: {
        parts: [
          {
            text: prompt,
          },
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
        ],
      },
      // Note: imageConfig for 4K is not supported in Flash-Lite/Flash-Image, so we remove it.
      // The model will determine the best output resolution.
    });

    // Extract image from response
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          return part.inlineData.data;
        }
      }
    }
    
    throw new Error("No image data found in response.");
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};