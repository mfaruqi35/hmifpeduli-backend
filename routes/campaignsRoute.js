import express from "express";
import upload, { uploadImages } from "../middleware/multer.js";
import {
  createCampaign,
  deleteCampaign,
  editCampaign,
  getAllCampaign,
  getCampaignDetail,
} from "../controllers/campaignController.js";

const campaignRouter = express.Router();

campaignRouter.get("/", getAllCampaign);
campaignRouter.post("/createCampaign", uploadImages, createCampaign);
campaignRouter.get("/:campaignId", getCampaignDetail);
campaignRouter.put("/editCampaign/:campaignId", editCampaign);
campaignRouter.delete("/deleteCampaign/:campaignId", deleteCampaign);

export default campaignRouter;
