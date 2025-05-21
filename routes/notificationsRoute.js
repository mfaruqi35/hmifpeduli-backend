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
<<<<<<< HEAD
notificationRouter.patch("/:userId/read", authUser, markAsRead);
notificationRouter.patch("/:userId/markAllRead", authUser, markAllAsRead);
notificationRouter.delete("/:userId", authUser, deleteNotification);
=======
notificationRouter.patch("/:id/read", authUser, markAsRead);
notificationRouter.patch("/:id/markAllRead", authUser, markAllAsRead);
notificationRouter.delete("/:id", authUser, deleteNotification);
>>>>>>> 1def7b59942800ba3e9e3a8c4695b6d43d43826c

export default notificationRouter;
