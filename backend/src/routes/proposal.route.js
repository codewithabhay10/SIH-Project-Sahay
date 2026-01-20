import express from "express";
import isAuthenticated from "../middlewares/auth.middleware.js";
import { uploadSupportingDocs } from "../middlewares/upload.middleware.js";
import {
  saveDraft,
  submitProposal,
  listProposals,
  getProposalById,
  updateProposalStatus,
  approveProposal,
  rejectProposal,
} from "../controllers/proposal.controller.js";

const router = express.Router();

// Save as draft (authenticated)
router.post("/draft", isAuthenticated, uploadSupportingDocs, saveDraft);

// Submit proposal (authenticated + role check enforced in controller)
router.post("/submit", isAuthenticated, uploadSupportingDocs, submitProposal);

// List proposals (authenticated)
router.get("/", isAuthenticated, listProposals);

// Get single proposal (authenticated)
router.get("/:id", isAuthenticated, getProposalById);

// Update proposal status (authenticated)
router.patch("/:id/status", isAuthenticated, updateProposalStatus);

// Approve proposal (authenticated)
router.patch("/:id/approve", isAuthenticated, approveProposal);

// Reject proposal (authenticated)
router.patch("/:id/reject", isAuthenticated, rejectProposal);

export default router;
