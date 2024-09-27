import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

if (!apiKey) {
  console.warn("GEMINI_API_KEY (or GOOGLE_API_KEY) is not configured.");
}

const genAI = new GoogleGenerativeAI(apiKey || "");

// Use a stronger default model and gracefully fall back when quota/model access differs by account.
export const defaultModelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";

const fallbackModelsFromEnv = (process.env.GEMINI_FALLBACK_MODELS || "")
  .split(",")
  .map((item) => item.trim())
  .filter(Boolean);

// Priority order: explicit model, env fallbacks, then built-in fallback models.
const builtInFallbackModels = ["gemini-flash-latest", "gemini-2.5-flash-lite", "gemini-2.0-flash-lite"];

export const modelPriority = [
  defaultModelName,
  ...fallbackModelsFromEnv,
  ...builtInFallbackModels,
].filter((modelName, index, list) => list.indexOf(modelName) === index);

export const getAIModel = (modelName = defaultModelName, systemInstruction) =>
  genAI.getGenerativeModel({
    model: modelName,
    ...(systemInstruction ? { systemInstruction } : {}),
  });

export default genAI;
