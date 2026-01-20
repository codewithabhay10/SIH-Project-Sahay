import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export async function signup(req, res) {
  try {
    const { phoneNumber, password, role, beneficaryInfo, enumeratorInfo } =
      req.body;

    if (!phoneNumber || !password) {
      return res
        .status(400)
        .json({ error: "phoneNumber and password are required" });
    }

    const existing = await User.findOne({ phoneNumber });
    if (existing) {
      return res
        .status(409)
        .json({ error: "User with this phone number already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = new User({
      phoneNumber,
      password: hashed,
      role: role || undefined,
      beneficaryInfo,
      enumeratorInfo,
    });

    await user.save();

    const payload = { id: user._id.toString(), role: user.role };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      sameSite: "lax",
    });

    const userSafe = {
      id: user._id,
      phoneNumber: user.phoneNumber,
      role: user.role,
      beneficaryInfo: user.beneficaryInfo,
      enumeratorInfo: user.enumeratorInfo,
    };

    return res.status(201).json({ user: userSafe, token });
  } catch (err) {
    console.error("Signup error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function login(req, res) {
  try {
    const { phoneNumber, password } = req.body;
    if (!phoneNumber || !password) {
      return res
        .status(400)
        .json({ error: "phoneNumber and password are required" });
    }

    const user = await User.findOne({ phoneNumber });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    const payload = { id: user._id.toString(), role: user.role };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7,
      sameSite: "lax",
    });

    const userSafe = {
      id: user._id,
      phoneNumber: user.phoneNumber,
      role: user.role,
      beneficaryInfo: user.beneficaryInfo,
      enumeratorInfo: user.enumeratorInfo,
    };

    return res.json({ user: userSafe, token });
  } catch (err) {
    console.error("Login error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function logout(req, res) {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    return res.json({ message: "Logged out" });
  } catch (err) {
    console.error("Logout error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
