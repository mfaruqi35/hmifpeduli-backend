import express from "express";
import upload from "../middleware/multer.js";
import {
  createCampaign,
  deleteCampaign,
  editCampaign,
  getAllCampaign,
  getCampaignDetail,
} from "../controllers/campaignController.js";

const campaignRouter = express.Router();

campaignRouter.get("/", getAllCampaign);
campaignRouter.post(
  "/createCampaign",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "documentationImages", maxCount: 10 },
  ]),
  createCampaign
);
campaignRouter.get("/:campaignId", getCampaignDetail);
campaignRouter.put("/editCampaign/:campaignId", editCampaign);
campaignRouter.delete("/deleteCampaign/:campaignId", deleteCampaign);

export default campaignRouter;
