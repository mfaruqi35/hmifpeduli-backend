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

dotenv.config();

const app = express();
const PORT = 3000;

//connect to mongodb
mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to MongoDB"));

//middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.use("/users", userRouter);
app.use("/admins", adminRouter);
app.use("/campaigns", campaignRouter);
app.use("/donations", donationRouter);
app.use("/notifications", notificationRouter);

app.listen(PORT, () => console.log(`Server Started in port: ${PORT}`));
