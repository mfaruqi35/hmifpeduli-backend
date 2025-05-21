import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import userRouter from "./routes/usersRoute.js";
import campaignRouter from "./routes/campaignsRoute.js";
import adminRouter from "./routes/adminsRoute.js";
import donationRouter from "./routes/donationsRoute.js";
import notificationRouter from "./routes/notificationsRoute.js";
import allocationRouter from "./routes/allocationRoute.js";

dotenv.config();

const app = express();
const PORT = 3000;

// Connect to MongoDB
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to MongoDB"));

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" })); // Limit JSON body size for large payloads
app.use(express.urlencoded({ limit: "50mb", extended: true })); // Limit URL encoded body size

// Route Handlers
app.use("/users", userRouter);
app.use("/admins", adminRouter);
app.use("/campaigns", campaignRouter);
app.use("/donations", donationRouter);
app.use("/allocations", allocationRouter);
app.use("/notifications", notificationRouter);

// Start the server
app.listen(PORT, () => console.log(`Server Started on port: ${PORT}`));
