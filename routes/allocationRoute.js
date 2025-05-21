import express from "express";
import {
  createAllocation,
  getAllocationsByCampaign,
} from "../controllers/allocationController";

const allocationRouter = express.Router();

allocationRouter.post("/createAllocation", createAllocation);
allocationRouter.get("/:campaignId", getAllocationsByCampaign);

export default allocationRouter;
