import jwt from "jsonwebtoken";
import usersModel from "../models/usersModel.js";
import adminsModel from "../models/adminsModel.js";

// Middleware untuk autentikasi pengguna
export const authUser = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res
        .status(401)
        .json({ message: "Not authorized, no token provided!" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Memastikan bahwa token adalah untuk pengguna, bukan admin
    if (!decoded.type || decoded.type !== "user") {
      return res.status(401).json({ message: "Invalid token type" });
    }

    req.user = await usersModel.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token." });
  }
};


export const authAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // ✅ Cek apakah header Authorization ada dan valid
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization header missing or invalid" });
    }

    const token = authHeader.split(" ")[1]; // Ambil token setelah 'Bearer '

    // ✅ Verifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Pastikan token ini untuk admin
    if (decoded.type !== "admin") {
      return res.status(403).json({ message: "Unauthorized - not an admin token" });
    }

    // ✅ Ambil data admin dari database
    const admin = await adminsModel.findById(decoded.id).select("-password");
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    req.admin = admin; // simpan admin ke request
    next(); // lanjut ke controller

  } catch (error) {
    console.error("authAdmin Error:", error);
    res.status(401).json({ message: "Token tidak valid atau sudah kadaluarsa" });
  }
};

// middleware/optionalAuth.js
export const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Pastikan token dari user (bukan admin)
      if (decoded.type === "user") {
        const user = await usersModel.findById(decoded.id).select("-password");
        if (user) {
          req.user = user; // simpan user lengkap di req.user
        }
      }
    } catch (err) {
      console.log("Token tidak valid, lanjutkan tanpa user");
    }
  }
  next();
};

