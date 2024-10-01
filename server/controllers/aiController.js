import Resume from "../models/Resume.js";
import { generateJsonContent, generateTextContent } from "../services/aiService.js";

const toSafeString = (value) => (typeof value === "string" ? value.trim() : "");

const toSafeStringArray = (value) =>
  Array.isArray(value)
    ? value.map((item) => toSafeString(item)).filter(Boolean)
    : [];

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

const normalizeResumeData = (rawData = {}) => {
  const personalInfo = rawData.personal_info || rawData.personalInfo || {};
  const experience = Array.isArray(rawData.experience) ? rawData.experience : [];
  const project = Array.isArray(rawData.project)
    ? rawData.project
    : Array.isArray(rawData.projects)
    ? rawData.projects
    : [];
  const education = Array.isArray(rawData.education) ? rawData.education : [];

  return {
    professional_summary: toSafeString(rawData.professional_summary),
    skills: toSafeStringArray(rawData.skills),
    personal_info: {
      image: toSafeString(personalInfo.image),
      full_name: toSafeString(personalInfo.full_name),
      profession: toSafeString(personalInfo.profession),
      phone: toSafeString(personalInfo.phone),
      email: toSafeString(personalInfo.email),
      location: toSafeString(personalInfo.location),
      linkedin: toSafeString(personalInfo.linkedin),
      website: toSafeString(personalInfo.website),
    },
    experience: experience.map((item) => ({
      company: toSafeString(item?.company),
      position: toSafeString(item?.position),
      start_date: toSafeString(item?.start_date),
      end_date: toSafeString(item?.end_date),
      description: toSafeString(item?.description),
      is_current: item?.is_current === true || item?.is_current === "true",
    })),
    project: project.map((item) => ({
      name: toSafeString(item?.name),
      type: toSafeString(item?.type),
      description: toSafeString(item?.description),
    })),
    education: education.map((item) => ({
      institution: toSafeString(item?.institution),
      degree: toSafeString(item?.degree),
      field: toSafeString(item?.field),
      graduation_date: toSafeString(item?.graduation_date),
      gpa: toSafeString(item?.gpa),
    })),
  };
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

// controller for uploading resume to database
// POST : /api/ai/upload-resume
export const uploadResume = async (req, res) => {
  try {
    const { resumeText, title } = req.body;
    const userId = req.userId;

    if (!resumeText || !title) {
      return res.status(400).json({ message: "Resume text and title are required" });
    }

    const MAX_RESUME_CHARS = 18000;
    const trimmedResumeText = String(resumeText).slice(0, MAX_RESUME_CHARS);

    const systemPrompt =
      "Extract structured resume data into valid JSON only. Use empty strings for missing text fields, false for missing booleans, and empty arrays for missing lists.";

    const userPrompt = [
      "Read the resume text and return JSON with this exact shape:",
      "{",
      '  "professional_summary": "",',
      '  "skills": [""],',
      '  "personal_info": {',
      '    "image": "",',
      '    "full_name": "",',
      '    "profession": "",',
      '    "phone": "",',
      '    "email": "",',
      '    "location": "",',
      '    "linkedin": "",',
      '    "website": ""',
      "  },",
      '  "experience": [{',
      '    "company": "",',
      '    "position": "",',
      '    "start_date": "",',
      '    "end_date": "",',
      '    "description": "",',
      '    "is_current": false',
      "  }],",
      '  "project": [{',
      '    "name": "",',
      '    "type": "",',
      '    "description": ""',
      "  }],",
      '  "education": [{',
      '    "institution": "",',
      '    "degree": "",',
      '    "field": "",',
      '    "graduation_date": "",',
      '    "gpa": ""',
      "  }]",
      "}",
      "",
      "Resume text:",
      trimmedResumeText,
    ].join("\n");

    const extractedData = await generateJsonContent({
      systemPrompt,
      userPrompt,
      temperature: 0.2,
    });

    const parsedData = normalizeResumeData(extractedData);

    const newResume = await Resume.create({
      userId,
      title,
      ...parsedData,
    });

    res.json({ resumeId: newResume._id, message: "Resume uploaded successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to upload resume", error: error.message });
  }
};
