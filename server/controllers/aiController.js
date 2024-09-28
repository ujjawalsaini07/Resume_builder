import { generateTextContent } from "../services/aiService.js";

const toSafeString = (value) => (typeof value === "string" ? value.trim() : "");

const cleanEnhancedText = (rawText = "") => {
  let text = String(rawText || "").trim();

  text = text.replace(/^```(?:text|markdown)?\s*/i, "").replace(/\s*```$/i, "").trim();

  // If the model returns multiple options, keep only the first one.
  const multiOptionMatch = text.match(/(?:^|\n)\s*(?:\*\*)?Option\s*1\b[^\n]*\n([\s\S]*?)(?:\n\s*(?:\*\*)?Option\s*2\b|$)/i);
  if (multiOptionMatch?.[1]) {
    text = multiOptionMatch[1].trim();
  }

  // Remove common heading/label prefixes.
  text = text
    .replace(/^\s*(?:enhanced\s+summary|enhanced\s+professional\s+summary|enhanced\s+job\s+description)\s*[:\-]\s*/i, "")
    .replace(/^\s*(?:summary|professional\s+summary|job\s+description)\s*[:\-]\s*/i, "")
    .replace(/^\s*(?:\*\*)?option\s*\d+\s*(?:\*\*)?\s*[:\-]?\s*/i, "")
    .trim();

  // Keep plain text clean and readable.
  text = text.replace(/\n{3,}/g, "\n\n").trim();

  return text;
};

// controller for enhancing professional summary content
// POST : /api/ai/summary
export const enhanceProfessionalSummary = async (req, res) => {
  try {
    const userContent = toSafeString(req.body?.userContent);

    if (!userContent) {
      return res.status(400).json({ message: "User content is required" });
    }

    const rawEnhancedContent = await generateTextContent({
      systemPrompt:
        "You are an expert resume writer. Rewrite the given professional summary into one improved ATS-friendly version. Return only the rewritten summary text. Do not provide multiple options, headings, labels, explanations, markdown, or quotation marks. Keep the facts aligned with the user input and avoid inventing details.",
      userPrompt: [
        "Rewrite this professional summary into a single improved version.",
        "",
        "User summary:",
        userContent,
      ].join("\n"),
      temperature: 0.4,
    });

    const enhancedContent = cleanEnhancedText(rawEnhancedContent);

    if (!enhancedContent) {
      return res.status(500).json({ message: "Failed to generate enhanced summary" });
    }

    return res.status(200).json({ enhancedContent });
  } catch (error) {
    return res.status(500).json({ message: "Failed to enhance professional summary", error: error.message });
  }
};

// controller for enhancing job description content
// POST : /api/ai/jobdescription
export const enhanceJobDescription = async (req, res) => {
  try {
    const userContent = toSafeString(req.body?.userContent);

    if (!userContent) {
      return res.status(400).json({ message: "User content is required" });
    }

    const rawEnhancedContent = await generateTextContent({
      systemPrompt:
        "You are an expert resume writer. Rewrite the given job description into one improved ATS-friendly version with concise, measurable, achievement-focused wording. Return only the rewritten job description text. Do not provide options, headings, labels, explanations, markdown, or quotation marks. Keep it relevant to the user input and do not invent unrelated details.",
      userPrompt: [
        "Rewrite this job description into a single improved version.",
        "",
        "User job description:",
        userContent,
      ].join("\n"),
      temperature: 0.4,
    });

    const enhancedContent = cleanEnhancedText(rawEnhancedContent);

    if (!enhancedContent) {
      return res.status(500).json({ message: "Failed to generate enhanced job description" });
    }

    return res.status(200).json({ enhancedContent });
  } catch (error) {
    return res.status(500).json({ message: "Failed to enhance professional summary", error: error.message });
  }
};
