import express from "express";
import {
  createReport,
  getReportsByCampaign,
  getAllReports,
  updateReport,
  getReportById,
} from "../controllers/reportController.js";

const router = express.Router();

router.post("/", createReport);
router.get("/", getAllReports);
router.get("/campaign/:campaignId", getReportsByCampaign); // lebih aman & eksplisit
router.get("/:id", getReportById);
router.put("/:id", updateReport);

export default router;
