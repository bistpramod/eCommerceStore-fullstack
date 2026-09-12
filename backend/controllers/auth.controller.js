import User from "../models/user.model.js";
import { hashPassword, comparePassword } from "../utils/bcrypt.utils.js";
import jwt from "jsonwebtoken";
// import bcrypt from "bcryptjs";

//? CREATE DEFAULT ADMIN
export const createAdmin = async () => {
  try {
    const adminExists = await User.findOne({
      email: process.env.ADMIN_EMAIL,
    });

    if (adminExists) {
      return;
    }

    const hashedPassword = await hashPassword(process.env.ADMIN_PASSWORD);

    await User.create({
      name: "Admin",
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
      role: "admin",
    });

    console.log("Default admin created");
  } catch (error) {
    console.log("Admin creation error:", error);
  }
};

//? SIGNUP USER
export const signupUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    //* Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "This user already exists",
      });
    }

    //* Hash password
    const hashedPassword = await hashPassword(password);

    //* Create user
    await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "Sign up successful",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

//?  LOGIN USER
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    //* Check if user already exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    //* compare password
    const matchPass = await comparePassword(password, user.password);

    if (!matchPass) {
      return res.status(400).json({
        message: "password incorrect",
      });
    }

    //* generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "server error",
      error,
    });
  }
};