import express from "express";
<<<<<<< HEAD
import { createDonation, getDonationsByCampaign, verifyDonationStatus, getAllDonations } from "../controllers/donationController.js";
import { optionalAuth } from "../middleware/middleware.js";

const router = express.Router();

router.post("/", optionalAuth, createDonation);
router.get("/", getAllDonations); // di donationsRoute.js
router.get("/donations/:campaignId", getDonationsByCampaign);
router.patch("/verify/:donationId", verifyDonationStatus);

export default router;
=======
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
>>>>>>> 1def7b59942800ba3e9e3a8c4695b6d43d43826c
