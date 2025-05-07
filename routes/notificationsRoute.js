import express from "express";
import { authUser } from "../middleware/middleware.js";
import {
  createNotification,
  deleteNotification,
  getUserNotification,
  markAllAsRead,
  markNotificationAsRead,
} from "../controllers/notificationController.js";

const notificationRouter = express.Router();

notificationRouter.post("/", createNotification);
notificationRouter.get("/", authUser, getUserNotification);
notificationRouter.patch("/:id/read", markNotificationAsRead);
notificationRouter.patch("/:id/mark-all-read", markAllAsRead);
notificationRouter.delete("/:id", deleteNotification);

export default notificationRouter;
