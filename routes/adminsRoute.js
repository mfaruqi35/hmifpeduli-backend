import express from "express";
import { loginAdmin, getAdminProfile } from "../controllers/adminController.js";
import { authAdmin } from "../middleware/middleware.js"; // Middleware untuk auth token admin

const adminRouter = express.Router();

// Auth Admin
adminRouter.post("/login", loginAdmin);

// Endpoint untuk mendapatkan profil admin
adminRouter.get("/profile", authAdmin, getAdminProfile);

export default adminRouter;
