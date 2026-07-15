import User from "../models/user.model.js";
import { hashPassword } from "../utils/bcrypt.utils.js";

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