import express from "express";
import protect from "../middlewares/authMiddleware.js";

import {
  createResume,
  deleteResume,
  getPublicResumeById,
  getResumeById,
} from "../controllers/resumeController.js";

const resumeRouter = express.Router();

resumeRouter.post("/create", protect, createResume);

resumeRouter.delete("/delete/:resumeId", protect, deleteResume);

resumeRouter.get("/get/:resumeId", protect, getResumeById);

resumeRouter.get("/public/:resumeId", protect, getPublicResumeById);

export default resumeRouter;
