import User from "../models/user.model.js";
import { hashPassword, comparePassword } from "../utils/bcrypt.utils.js";
import jwt from "jsonwebtoken";
// import bcrypt from "bcryptjs";

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
      // FIX: removed `error` because it doesn't exist here
      return res.status(400).json({
        message: "User not found",
      });
    }

    //* compare password

    // FIX: moved this code outside the `if (!user)` block
    // FIX: use imported `comparePassword` function
    const matchPass = await comparePassword(password, user.password);

    if (!matchPass) {
      return res.status(400).json({
        message: "password incorrect",
      });
    }

    //* generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // FIX: added `return`
    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "server error",
      error,
    });
  }
};