import imagekit from "../configs/imageKit.js";
import Resume from "../models/Resume.js";
import fs from "fs";

// controller for creating new resume
// POST : /api/resumes/create
export const createResume = async (req, res) => {
  try {
    const userId = req.userId;

    const { title } = req.body;

    const newResume = await Resume.create({ userId, title });
    return res.status(201).json({ message: "Resume created successfully", resume: newResume });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// controller for deleting resume
// DELETE : /api/resumes/delete
export const deleteResume = async (req, res) => {
  try {
    const userId = req.userId;
    const resumeId = req.params.resumeId;

    const deletedResume = await Resume.findOneAndDelete({ userId, _id: resumeId });

    if (!deletedResume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    return res.status(200).json({ message: "Resume deleted successfully" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// get resume by id
// GET : /api/resumes/get
export const getResumeById = async (req, res) => {
  try {
    const userId = req.userId;
    const resumeId = req.params.resumeId;

    const resume = await Resume.findOne({ userId, _id: resumeId });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    return res.status(200).json({ resume });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// get resume by id public
// GET : /api/resumes/public
export const getPublicResumeById = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const resume = await Resume.findOne({ public: true, _id: resumeId });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    return res.status(200).json({ resume });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// controller for updating resume
// PUT : /api/resumes/update
export const updateResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId, resumeData, removeBackground, title } = req.body;

    if (!resumeId) {
      return res.status(400).json({ message: "Resume id is required" });
    }

    // using multer middleware to get image file from request
    const image = req.file;

    let resumeDataCopy = {};
    if (typeof resumeData === "string" && resumeData.trim()) {
      resumeDataCopy = JSON.parse(resumeData);
    } else if (resumeData && typeof resumeData === "object") {
      resumeDataCopy = structuredClone(resumeData);
    }

    if (!resumeDataCopy || typeof resumeDataCopy !== "object" || Array.isArray(resumeDataCopy)) {
      return res.status(400).json({ message: "resumeData must be a valid object" });
    }

    if (typeof title === "string") {
      resumeDataCopy.title = title.trim();
    }

    if (image) {
      const imageBufferData = fs.createReadStream(image.path);
      const baseImageTransformation = "w-300,h-300,fo-face,z-0.75";
      const imageTransformation = removeBackground
        ? `${baseImageTransformation},e-bgremove,f-png`
        : baseImageTransformation;

      const response = await imagekit.files.upload({
        file: imageBufferData,
        fileName: removeBackground ? "resume.png" : (image.mimetype?.includes("png") ? "resume.png" : "resume.jpg"),
        folder: "user-resumes",
        transformation: {
          pre: imageTransformation,
        },
      });

      if (!resumeDataCopy.personal_info) {
        resumeDataCopy.personal_info = {};
      }

      resumeDataCopy.personal_info.image = response.url;
    }

    if (Object.keys(resumeDataCopy).length === 0) {
      return res.status(400).json({ message: "No valid fields provided for update" });
    }

    const resume = await Resume.findOneAndUpdate(
      { userId, _id: resumeId },
      { $set: resumeDataCopy },
      { returnDocument: "after" }
    );

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    return res.status(200).json({ message: "Resume updated successfully", resume });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
