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
notificationRouter.patch("/:id/read", authUser, markNotificationAsRead);
notificationRouter.patch("/:id/mark-all-read", authUser, markAllAsRead);
notificationRouter.delete("/:id", authUser, deleteNotification);

export default notificationRouter;
