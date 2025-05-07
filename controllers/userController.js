import usersModel from "../models/usersModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateUserToken = (userId) => {
  try {
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined in environment variables");
      return null;
    }

    const token = jwt.sign(
      { id: userId, type: "user" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return token;
  } catch (error) {
    console.error("Error generating token:", error);
    return null;
  }
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please fill all required fields" });
    }

    const isAlreadyRegistered = await usersModel.findOne({ email });
    if (isAlreadyRegistered) {
      return res
        .status(400)
        .json({ message: "User with this email is already registered" });
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = new usersModel({
        name,
        email,
        password: hashedPassword,
      });

      const savedUser = await newUser.save();
      const token = generateUserToken(newUser._id);
      res.status(201).json({
        message: "Succesfull Register",
        token: token,
        user: {
          id: savedUser._id,
          name: savedUser.name,
          email: savedUser.email,
        },
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: "Please fill all required fields" });
    } else {
      const user = await usersModel.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Password incorrect" });
      }

      const token = generateUserToken(usersModel._id);

      res.status(200).json({
        message: "login Successful",
        token: token,
        user: { id: user._id, name: user.name, email: user.email },
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllUser = async (req, res) => {
  try {
    const users = await usersModel.find();
    const usersData = Promise.all(
      users.map(async (user) => {
        return {
          user: {
            email: user.email,
            name: user.name,
            total: user.totalDonasi,
          },
          userId: user._id,
        };
      })
    );
    res.status(200).json(await usersData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.params.userId;
    const userData = await usersModel.findById(userId);
    if (userData == null) {
      return res.status(404).json({ message: "cannot find user" });
    }
    res.status(200).json(userData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const editProfile = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { name, email, phoneNumber } = req.body;
    const user = await usersModel.findById(userId);
    if (!user) {
      res.status(400).json({ message: "User not found" });
    }
    // if (name) user.name = name;
    // if (email) user.email = email;
    // if (phoneNumber) user.phoneNumber = phoneNumber;

    user.set("name", name);
    user.set("email", email);
    user.set("phoneNumber", phoneNumber);

    await user.save();

    res
      .status(200)
      .json({ message: "Profile updated successfully.", data: user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
