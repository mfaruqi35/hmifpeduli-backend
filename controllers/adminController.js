import adminsModel from "../models/adminsModel.js";
import jwt from "jsonwebtoken";

const generateAdminToken = (adminId) => {
  try {
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined in environment variables");
      return null;
    }

    const token = jwt.sign(
      { id: adminId, type: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return token;
  } catch (error) {
    console.error("Error generating token:", error);
    return null;
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const admin = await adminsModel.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Admin not found" });
    }

    // Cek password secara langsung (tanpa hash)
    if (password !== admin.password) {
      return res.status(400).json({ message: "Password incorrect" });
    }

    const token = generateAdminToken(admin._id);

    res.status(200).json({
      message: "Login Successful",
      token: token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fungsi untuk mendapatkan profil admin
export const getAdminProfile = async (req, res) => {
  try {
    const admin = req.admin;

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Kembalikan dalam objek { admin: {...} }
    res.status(200).json({
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        phoneNumber: admin.phoneNumber,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
