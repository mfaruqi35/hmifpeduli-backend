// routes/userRoute

import express from "express";
import {
  registerUser,
  loginUser,
  getAllUser,
  getUserProfile,
  editProfile,
} from "../controllers/userController.js";

const router = express.Router();

// Route untuk registrasi pengguna
router.post("/register", registerUser);

// Route untuk login pengguna
router.post("/login", loginUser);

// Route untuk mendapatkan profil pengguna, hanya bisa diakses oleh pengguna yang sudah login
router.get("/profile", authUser, getUserProfile);

router.put('/profile', authUser, updateUserProfile);

export default router;
