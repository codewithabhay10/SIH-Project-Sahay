import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/users.model.js";

const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

function generateToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

const signup = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;
    if (!name || !email || !phone || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await User.findOne({ $or: [{ email }, { phone }] });
    if (existing) {
      return res.status(409).json({ message: "Email or phone already in use" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      phone,
      password: hashed,
      role,
    });

    const token = generateToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return res.status(201).json({
      message: "User created successfully",
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: err.message, success: false });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return res.json({
      message: "Login successful",
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: err.message, success: false });
  }
};

const logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
  });
  return res.json({ message: "Logged out", success: true });
};

export { signup, login, logout };
