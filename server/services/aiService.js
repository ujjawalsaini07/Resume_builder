import { getAIModel, modelPriority } from "../configs/ai.js";

const stripCodeFences = (text = "") =>
  text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

const extractFirstJSONObject = (text = "") => {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    return null;
  }

  return text.slice(start, end + 1);
};

const parseJSONObject = (text = "") => {
  const normalized = stripCodeFences(text);

  try {
    return JSON.parse(normalized);
  } catch {
    const maybeObject = extractFirstJSONObject(normalized);
    if (!maybeObject) {
      return null;
    }

    try {
      return JSON.parse(maybeObject);
    } catch {
      return null;
    }
  }
};

const shouldTryNextModel = (error) => {
  const message = String(error?.message || "").toLowerCase();
  return (
    message.includes("quota") ||
    message.includes("rate") ||
    message.includes("429") ||
    message.includes("not found") ||
    message.includes("unsupported") ||
    message.includes("permission")
  );
};

const generate = async ({ systemPrompt, userPrompt, expectJson = false, temperature = 0.4 }) => {
  const combinedPrompt = [
    "System instruction:",
    systemPrompt,
    "",
    "User input:",
    userPrompt,
  ].join("\n");
  let lastError = null;

  for (const modelName of modelPriority) {
    try {
      const model = getAIModel(modelName);

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: combinedPrompt }] }],
        generationConfig: {
          temperature,
          maxOutputTokens: 4096,
          ...(expectJson ? { responseMimeType: "application/json" } : {}),
        },
      });

      const output = result?.response?.text?.()?.trim();

      if (!output) {
        throw new Error(`AI provider returned an empty response (${modelName})`);
      }

      return output;
    } catch (error) {
      lastError = error;
      if (!shouldTryNextModel(error)) {
        break;
      }
    }
  }

  throw new Error(lastError?.message || "AI generation failed");
};

export const generateTextContent = async ({ systemPrompt, userPrompt, temperature = 0.4 }) =>
  generate({ systemPrompt, userPrompt, temperature, expectJson: false });

export const generateJsonContent = async ({ systemPrompt, userPrompt, temperature = 0.2 }) => {
  const firstResponse = await generate({
    systemPrompt,
    userPrompt,
    temperature,
    expectJson: true,
  });

  const parsed = parseJSONObject(firstResponse);

  if (parsed) {
    return parsed;
  }

  const secondResponse = await generate({
    systemPrompt,
    userPrompt: `${userPrompt}\n\nIMPORTANT: Return only valid JSON object. Do not add markdown, comments, or explanation.`,
    temperature,
    expectJson: false,
  });

  const parsedRetry = parseJSONObject(secondResponse);

  if (!parsedRetry) {
    throw new Error("Failed to parse AI response as JSON");
  }

  return parsedRetry;
};
