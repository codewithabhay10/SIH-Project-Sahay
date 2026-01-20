import express from "express";
import { signup, login, logout } from "../controllers/user.controller.js";

const router = express.Router();

// POST /api/users/signup
router.post("/signup", signup);

// POST /api/users/login
router.post("/login", login);

// POST /api/users/logout
router.post("/logout", logout);

export default router;
