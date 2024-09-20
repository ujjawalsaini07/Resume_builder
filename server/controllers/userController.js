import bcrypt from "bcrypt";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const generateToken = (userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  return token;
};

// controller for user registration
// POST : /api/users/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check if user already exists
    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    // before we need to hash the password for security reasons
    const hashedPassword = await bcrypt.hash(password, 10);

    // create new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // generate the token for response
    const token = generateToken(newUser._id);

    newUser.password = undefined;

    return res.status(201).json({
      message: "User registered successfully",
      user: newUser,
      token,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// controller for user login
// POST : /api/users/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check if user already exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // check if password matches
    if (!user.comparePassword(password)) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // return successful response with token
    const token = generateToken(user._id);
    user.password = undefined;

    return res.status(200).json({
      message: "Login successful",
      user,
      token,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
