import express from "express";
import {
  loginAdmin,
  registerAdmin,
  verifyDonation,
} from "../controllers/adminController.js";
import { authAdmin } from "../middleware/middleware.js";

const adminRouter = express.Router();

// Auth Admin
adminRouter.post("/register", registerAdmin);
adminRouter.post("/login", loginAdmin);

adminRouter.patch("/verify-donation/:donationId", authAdmin, verifyDonation);
export default adminRouter;
