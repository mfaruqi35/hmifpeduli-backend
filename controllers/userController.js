import User from "../models/usersModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Fungsi untuk membuat JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId, type: "user" }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

// Fungsi Registrasi Pengguna
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Pastikan semua data dikirimkan
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    // Cek apakah email sudah terdaftar
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email sudah terdaftar" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Hashed Password:', hashedPassword); // Log hashed password

    // Simpan data pengguna baru ke database
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    // Generate token
    const token = generateToken(newUser._id);

    // Kirim response sukses
    res.status(201).json({
      message: "Registrasi berhasil",
      token,
      user: { id: newUser._id, name: newUser.name, email: newUser.email },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Fungsi Login Pengguna
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Pastikan email dan password dikirimkan
    if (!email || !password)
      return res.status(400).json({ message: "All fields required" });

    // Cari pengguna berdasarkan email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Pengguna tidak ditemukan" });

    console.log("User password from DB:", user.password); // Log password dari DB
    console.log("Input password:", password); // Log password yang dimasukkan

    // Cek apakah password yang dimasukkan sesuai dengan hash di database
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match status:", isMatch); // Log status perbandingan

    if (!isMatch)
      return res.status(400).json({ message: "Password salah" });

    // Generate token
    const token = generateToken(user._id);

    // Kirim response sukses
    res.status(200).json({
      message: "Login berhasil",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Fungsi untuk mendapatkan profil pengguna
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Mengambil ID pengguna dari request yang sudah terverifikasi
    const user = await User.findById(userId).select("-password"); // Mengambil data pengguna tanpa password

    if (!user) {
      return res.status(404).json({ message: "Pengguna tidak ditemukan" });
    }

    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Fungsi untuk memperbarui profil pengguna
import usersModel from '../models/usersModel.js';

export const updateUserProfile = async (req, res) => {
  try {
    const user = await usersModel.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "Pengguna tidak ditemukan" });
    }

    const { name, email, phone } = req.body;

    // Validasi nomor HP internasional jika diberikan
    if (phone) {
      const phoneRegex = /^\+?[1-9]\d{7,14}$/;
      if (!phoneRegex.test(phone)) {
        return res.status(400).json({ message: "Nomor HP tidak valid. Harus terdiri dari 8-15 digit dan boleh diawali dengan +" });
      }
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.phoneNumber = phone || user.phoneNumber;

    const updatedUser = await user.save();

    return res.json({
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phoneNumber: updatedUser.phoneNumber,
      },
    });
  } catch (error) {
    console.error("Update error:", error); 
    return res.status(500).json({ message: "Server error saat update profile" });
  }
};

