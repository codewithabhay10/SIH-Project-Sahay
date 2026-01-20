import express from "express";
import isAuthenticated from "../middlewares/auth.middleware.js";
import { uploadSupportingDocs } from "../middlewares/upload.middleware.js";
import {
  saveDraftProject,
  submitProject,
} from "../controllers/project.controller.js";
import { getAllProjects } from "../controllers/project.controller.js";
import {
  approveProject,
  rejectProject,
} from "../controllers/project.controller.js";
import { releaseFunds } from "../controllers/mosje.controller.js";

const router = express.Router();

// Save or update draft
router.post("/draft", isAuthenticated, uploadSupportingDocs, saveDraftProject);

// Submit project (only 'state' allowed; controller enforces role)
router.post("/submit", isAuthenticated, uploadSupportingDocs, submitProject);

// Get all projects (authenticated)
router.get("/", isAuthenticated, getAllProjects);

// Approve / reject endpoints (only 'pacc' role enforced in controller)
router.post("/:id/approve", isAuthenticated, approveProject);
router.post("/:id/reject", isAuthenticated, rejectProject);
// Release funds (only mosje allowed; controller enforces role)
router.post("/:id/release", isAuthenticated, releaseFunds);

export default router;
