import express from "express";
import { signup, login, logout } from "../controllers/users.controller.js";

const router = express.Router();

// Create a new user
router.post("/signup", signup);

// Login existing user
router.post("/login", login);

// Logout (clears auth cookie)
router.post("/logout", logout);

export default router;
