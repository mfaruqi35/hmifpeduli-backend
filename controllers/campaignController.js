import mongoose from "mongoose";
import validator from "validator";
import campaignsModel from "../models/campaignsModel.js";

// Fungsi validasi
const isValidEmail = (email) => validator.isEmail(email);
const isValidPhone = (phone) => validator.isMobilePhone(phone + "", "any"); // otomatis dukung berbagai format internasional
const isValidAccountNumber = (number) => /^[0-9]+$/.test(number);

export const createCampaign = async (req, res) => {
  try {
    const {
      campaignName,
      description,
      fundTarget,
      startDate,
      endDate,
      pictures,
      category,
      campaignStatus,
      bankInfo,
      contactPerson,
    } = req.body;

    if (
      !campaignName ||
      !fundTarget ||
      !startDate ||
      !endDate ||
      !pictures ||
      !Array.isArray(pictures) ||
      pictures.length === 0 ||
      !bankInfo ||
      !contactPerson
    ) {
      return res.status(400).json({
        message: "Please fill all required fields including pictures, bankInfo, and contactPerson",
      });
    }

    // Validasi gambar
    const isValidBase64 = pictures.every((pic) =>
      /^data:image\/(png|jpeg|jpg|webp);base64,/.test(pic)
    );
    if (!isValidBase64) {
      return res.status(400).json({ message: "All pictures must be Base64-encoded images" });
    }

    // Validasi bankInfo
    const { bankName, accountNumber, accountName, bankCode } = bankInfo;
    if (!bankName || !accountNumber || !accountName || !bankCode) {
      return res.status(400).json({ message: "All bankInfo fields are required" });
    }
    if (!isValidAccountNumber(accountNumber)) {
      return res.status(400).json({ message: "Invalid account number format" });
    }

    // Validasi contactPerson
    const { name, phone, email } = contactPerson;
    if (!name || !phone || !email) {
      return res.status(400).json({ message: "All contactPerson fields are required" });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    if (!isValidPhone(phone)) {
      return res.status(400).json({ message: "Invalid phone number format" });
    }

    const newCampaign = new campaignsModel({
      campaignName,
      description,
      fundTarget,
      startDate,
      endDate,
      pictures,
      category,
      campaignStatus,
      bankInfo,
      contactPerson,
    });

    const savedCampaign = await newCampaign.save();
    res.status(201).json({
      message: "New Campaign Created",
      campaign: {
        id: savedCampaign._id,
        campaignName: savedCampaign.campaignName,
        campaignStatus: savedCampaign.campaignStatus,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllCampaign = async (req, res) => {
  try {
    const campaigns = await campaignsModel.find();

    const campaignData = await Promise.all(
      campaigns.map(async (campaign) => {
        return {
          campaign: {
            name: campaign.campaignName,
            target: campaign.fundTarget,
            collected: campaign.fundCollected,
            category: campaign.category,
            image: campaign.pictures[0],
            status: campaign.campaignStatus,
            startDate: campaign.startDate,
            endDate: campaign.endDate,
            bankInfo: campaign.bankInfo,
            contactPerson: campaign.contactPerson,
          },
          campaignId: campaign._id,
        };
      })
    );

    res.status(200).json(campaignData);
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCampaignDetail = async (req, res) => {
  try {
    const { campaignId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(campaignId)) {
      return res.status(400).json({ message: "Invalid campaign ID" });
    }

    const campaign = await campaignsModel.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    res.status(200).json(campaign);
  } catch (error) {
    console.error("Error fetching campaign detail:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const editCampaign = async (req, res) => {
  try {
    const campaignId = req.params.campaignId;
    const campaign = await campaignsModel.findById(campaignId);
    if (!campaign) {
      return res.status(400).json({ message: "Campaign not found" });
    }

    const editableFields = [
      "campaignName",
      "description",
      "fundTarget",
      "campaignStatus",
      "startDate",
      "endDate",
      "pictures",
      "category",
    ];

    editableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        campaign[field] = req.body[field];
      }
    });

    if (req.body.bankInfo) {
      const { bankName, accountNumber, accountName, bankCode } = req.body.bankInfo;
      if (!bankName || !accountNumber || !accountName || !bankCode) {
        return res.status(400).json({ message: "All bankInfo fields are required" });
      }
      if (!isValidAccountNumber(accountNumber)) {
        return res.status(400).json({ message: "Invalid account number format" });
      }

      campaign.bankInfo = {
        ...campaign.bankInfo,
        ...req.body.bankInfo,
      };
    }

    if (req.body.contactPerson) {
      const { name, phone, email } = req.body.contactPerson;
      if (!name || !phone || !email) {
        return res.status(400).json({ message: "All contactPerson fields are required" });
      }
      if (!isValidEmail(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }
      if (!isValidPhone(phone)) {
        return res.status(400).json({ message: "Invalid phone number format" });
      }

      campaign.contactPerson = {
        ...campaign.contactPerson,
        ...req.body.contactPerson,
      };
    }

    await campaign.save();
    res.status(200).json({
      message: "Campaign updated successfully",
      updatedCampaign: campaign,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCampaign = async (req, res) => {
  try {
    const campaignId = req.params.campaignId;
    if (!campaignId) {
      return res.status(400).json({ message: "Campaign id is required, but not provided" });
    }

    const deleteCampaign = await campaignsModel.findByIdAndDelete(campaignId);
    if (!deleteCampaign) {
      return res.status(400).json({ message: "Campaign not found" });
    }

    return res.status(200).json({
      message: "Campaign successfully deleted",
      data: deleteCampaign,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
