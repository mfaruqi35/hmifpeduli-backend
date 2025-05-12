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
notificationRouter.patch("/:id/read", authUser, markAsRead);
notificationRouter.patch("/:id/markAllRead", authUser, markAllAsRead);
notificationRouter.delete("/:id", authUser, deleteNotification);

export default notificationRouter;
