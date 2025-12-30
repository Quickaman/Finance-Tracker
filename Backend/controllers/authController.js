import User from "../models/User.js";
import jwt from "jsonwebtoken";

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Explicit check (best practice)
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        message: "User already exists with this email",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    res.status(201).json({
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    // Mongo duplicate key fallback (safety net)
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    res.status(500).json({
      message: "Registration failed",
    });
  }
};


export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password)))
    return res.status(401).json({ message: "Invalid credentials" });

  res.json({ token: generateToken(user._id) });
};
export const updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: "All fields required" });
  }

  const user = await User.findById(req.user.id);

  if (!user || !(await user.matchPassword(oldPassword))) {
    return res.status(401).json({ message: "Old password incorrect" });
  }

  user.password = newPassword;
  await user.save();

  res.json({ message: "Password updated successfully" });
};

