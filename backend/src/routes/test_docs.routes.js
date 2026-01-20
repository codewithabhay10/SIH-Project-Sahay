// routes/doc_check.route.js

import express from "express";
import multer from "multer";
import { checkDocument } from "../controllers/test_docs.controller.js";

const router = express.Router();

// Store uploads in ./uploads (make sure folder exists)
const upload = multer({ dest: "public/temp/" });

router.post("/doc-check", upload.single("pdf"), checkDocument);

export default router;
