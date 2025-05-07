import express from "express";
import { authUser } from "../middleware/middleware.js";
import { createDonation } from "../controllers/donationController.js";

const donationRouter = express.Router();

donationRouter.post("/", authUser, createDonation); // Login required
donationRouter.post("/guest", createDonation);

export default donationRouter;
