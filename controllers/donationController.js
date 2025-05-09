import donationsModel from "../models/donationsModel.js";
import usersModel from "../models/usersModel.js";
import campaignsModel from "../models/campaignsModel.js";
import notificationsModel from "../models/notificationsModel.js";

export const createDonation = async (req, res) => {
  try {
    const { amount, campaignId, paymentMethod } = req.body;
    const donaturId = req.usersModel?.id || null;

    if (!amount || !campaignId || !paymentMethod) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const campaign = await campaignsModel.findById(campaignId);
    if (!campaign) {
      return res.status(400).json({ message: "Campaign not found" });
    }

    let donaturName = "Orang Berjasa";
    if (donaturId) {
      const user = await usersModel.findById(donaturId);
      if (user) {
        donaturName = usersModel.name;
      }
    }

    const newDonation = new donationsModel({
      donaturName,
      amount,
      donaturId,
      campaignId,
      paymentMethod,
      donationStatus: "Pending",
    });

    await newDonation.save();

    // campaign.fundCollected += amount;
    // await campaign.save();

    // if (donaturId) {
    //   await usersModel.findByIdAndUpdate(donaturId, {
    //     $inc: { totalDonasi: amount },
    //   });
    // }
    await notificationsModel.create({
      UserId: req.user._id,
      title: "Donasi Tertunde",
      message: `Donasi kamu untuk ${campaign.campaignName} sedang diverifikasi oleh sistem`,
      notificationType: "donation",
    });

    res
      .status(201)
      .json({
        message: "Donasi dibuat dan sedang diverifikasi",
        donation: newDonation,
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRecentDonation = async (req, res) => {
  try {
    const recent = await donationsModel
      .find({ status: "Successful" })
      .sort({ donationDate: -1 })
      .limit(4)
      .populate("donaturId", "donaturName");
    res.status(200).json(recent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
