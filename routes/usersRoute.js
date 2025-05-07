import express from "express";
import {
  registerUser,
  loginUser,
  getAllUser,
  getUserProfile,
  editProfile,
} from "../controllers/userController.js";

const userRouter = express.Router();
// Auth User
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

//Profile
userRouter.get("/", getAllUser);
userRouter.get("/:userId", getUserProfile);
userRouter.put("/profile/:userId", editProfile);

export default userRouter;
