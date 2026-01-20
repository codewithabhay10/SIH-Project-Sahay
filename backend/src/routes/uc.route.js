import express from "express";
import multer from "multer";
import {
  createUC,
  getUCs,
  getUCById,
  updateUCStatus,
  deleteUC,
} from "../controllers/uc.controller.js";

const router = express.Router();

// Configure multer for file uploads
const upload = multer({ dest: "public/temp/" });

// UC Routes
router.post("/", upload.single("pdf"), createUC);
router.get("/", getUCs);
router.get("/:id", getUCById);
router.patch("/:id/status", updateUCStatus);
router.delete("/:id", deleteUC);

export default router;
