import express from "express";
import { authUser } from "../middleware/middleware.js";
import {
  createDonation,
  getRecentDonation,
} from "../controllers/donationController.js";
import { uploadImages } from "../middleware/multer.js";

const donationRouter = express.Router();

donationRouter.post("/", authUser, uploadImages, createDonation); // Login required
donationRouter.post("/guest", uploadImages, createDonation);
donationRouter.get("/recent", getRecentDonation);

export default donationRouter;
