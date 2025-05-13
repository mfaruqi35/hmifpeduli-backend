import adminsModel from "../models/adminsModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import donationsModel from "../models/donationsModel.js";
import notificationsModel from "../models/notificationsModel.js";
import campaignsModel from "../models/campaignsModel.js";

const generateAdminToken = (adminId) => {
  try {
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined in environment variables");
      return null;
    }

    const token = jwt.sign(
      { id: adminId, type: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return token;
  } catch (error) {
    console.error("Error generating token:", error);
    return null;
  }
};

export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ message: "Please fill all required fields" });
    }

    const isAlreadyRegistered = await adminsModel.findOne({ email });
    if (isAlreadyRegistered) {
      return res
        .status(400)
        .json({ message: "Admin with this email is already registered" });
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newAdmin = new adminsModel({
        name,
        email,
        password: hashedPassword,
      });

      const savedAdmin = await newAdmin.save();
      const token = generateAdminToken(newAdmin._id);
      res.status(200).json({
        message: "Admin Successfully registered",
        token: token,
        admin: {
          id: savedAdmin._id,
          name: savedAdmin.name,
          email: savedAdmin.email,
        },
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: "Please fill all required fields" });
    } else {
      const admin = await adminsModel.findOne({ email });
      if (!admin) {
        res.status(400).json({ message: "Admin not found" });
      }

      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Password incorrect" });
      }

      const token = generateAdminToken(adminsModel._id);

      res.status(200).json({
        message: "Login Successful",
        token: token,
        user: { name: admin.name },
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyDonation = async (req, res) => {
  try {
    const { donationId } = req.params;
    const { newStatus } = req.body;

    if (!["Successful", "Abort"].includes(newStatus)) {
      return res.status(400).json({ message: "Status tidak valid" });
    }

    const donation = await donationsModel
      .findById(donationId)
      .populate("campaignId");

    if (!donation) {
      return res.status(404).json({ message: "Donasi tidak ditemukan" });
    }

    if (
      donation.donationStatus === "Successful" ||
      donation.donationStatus === "Abort"
    ) {
      return res
        .status(400)
        .json({ message: "Donasi sudah diverifikasi sebelumnya" });
    }

    donation.donationStatus = newStatus;
    await donation.save();

    let message;
    if (newStatus === "Successful") {
      donation.campaignId.fundCollected += donation.amount;
      await donation.campaignId.save();
      message = `Donasi kaum untuk kampanye ${donation.campaignId.campaignName} telah berhasil. Terima kasih`;
    } else if (newStatus === "Abort") {
      message = `Donasi kamu untuk kampanye ${donation.campaignId.campaignName} dibatalkan`;
    }

    if (message) {
      await notificationsModel.create({
        userId: donation.donaturId,
        title: "Status Donasi",
        message,
        notificationType: "donation",
      });
    }

    res.status(200).json({ message: "Status donasi diperbarui" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
