import express from "express";
import { authUser } from "../middleware/middleware.js";
import {
  createNotification,
  deleteNotification,
  getUserNotification,
  markAllAsRead,
  markAsRead,
} from "../controllers/notificationController.js";

const notificationRouter = express.Router();

notificationRouter.post("/", createNotification);
notificationRouter.get("/", authUser, getUserNotification);
notificationRouter.patch("/:userId/read", authUser, markAsRead);
notificationRouter.patch("/:userId/markAllRead", authUser, markAllAsRead);
notificationRouter.delete("/:userId", authUser, deleteNotification);

export default notificationRouter;
