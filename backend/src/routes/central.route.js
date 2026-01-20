import express from "express";
import { getCentralInfo } from "../controllers/central.controller.js";

const router = express.Router();

// GET /api/central - returns central balance information
router.get("/", getCentralInfo);

export default router;
