import express from "express";
import { createDonation, getDonationsByCampaign, verifyDonationStatus, getAllDonations } from "../controllers/donationController.js";
import { optionalAuth } from "../middleware/middleware.js";

const router = express.Router();

router.post("/", optionalAuth, createDonation);
router.get("/", getAllDonations); // di donationsRoute.js
router.get("/donations/:campaignId", getDonationsByCampaign);
router.patch("/verify/:donationId", verifyDonationStatus);

export default router;
