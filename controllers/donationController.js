import donationsModel from "../models/donationsModel.js";
import usersModel from "../models/usersModel.js";
import campaignsModel from "../models/campaignsModel.js";
import notificationsModel from "../models/notificationsModel.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import upload from "../middleware/multer.js";

export const createDonation = async (req, res) => {
  try {
    const { amount, campaignId, paymentMethod } = req.body;
    const donaturId = req.user?.id || null;

    if (!amount || !campaignId || !paymentMethod) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!req.files || !req.files["proofImage"]) {
      return res.status(400).json({ message: "Proof image is required" });
    } else {
      const proofImage = req.files?.["proofImage"][0].buffer;
      const uploadResult = await uploadToCloudinary(
        proofImage,
        "donations_proof"
      );
      const proofImageUrl = uploadResult.secure_url;

      const campaign = await campaignsModel.findById(campaignId);
      if (!campaign) {
        return res.status(400).json({ message: "Campaign not found" });
      }

      let donaturName = "Orang Berjasa";
      if (donaturId) {
        const user = await usersModel.findById(donaturId);
        if (user) {
          donaturName = user.name;
        }
      }

      const newDonation = new donationsModel({
        donaturName,
        amount,
        donaturId,
        campaignId,
        paymentMethod,
        donationStatus: "Pending",
        proofImage: proofImageUrl,
      });

      await newDonation.save();

      if (req.user?._id) {
        await notificationsModel.create({
          userId: req.user._id,
          title: "Donasi Tertunda",
          message: `Donasi kamu untuk ${campaign.campaignName} sedang diverifikasi oleh sistem`,
          notificationType: "donation",
        });
      }

      res.status(201).json({
        message: "Donasi dibuat dan sedang diverifikasi",
        donation: newDonation,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRecentDonation = async (req, res) => {
  try {
    const recent = await donationsModel
      .find({ donationStatus: "Pending" })
      .sort({ donationDate: -1 })
      .limit(4)
      .populate("donaturId", "donaturName");
    res.status(200).json(recent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
