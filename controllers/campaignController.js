import upload from "../middleware/multer.js";
import campaignsModel from "../models/campaignsModel.js";
import notificationsModel from "../models/notificationsModel.js";
import usersModel from "../models/usersModel.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

export const createCampaign = async (req, res) => {
  try {
    const {
      campaignName,
      description,
      fundTarget,
      startDate,
      endDate,
      category,
    } = req.body;

    if (!campaignName || !fundTarget || !startDate || !endDate) {
      res.status(400).json({ message: "Please fill all required fields" });
    }
    if (!req.files || !req.files["thumbnail"]) {
      res.status(400).json({ message: "Thumbnail image is required" });
    } else {
      const thumbnailBuffer = req.files["thumbnail"][0].buffer;

      const thumbnailUpload = await uploadToCloudinary(
        thumbnailBuffer,
        "campaign_thumbnails"
      );
      const thumbnailUrl = thumbnailUpload.secure_url;

      let documentationUrls = [];
      if (
        req.files["documentationImages"] &&
        req.files["documentationImages"].length > 0
      ) {
        const uploadPromise = req.files["documentationImages"].map((file) =>
          uploadToCloudinary(file.buffer, "campaign_docs")
        );
        const uploadResults = await Promise.all(uploadPromise);
        documentationUrls = uploadResults.map((result) => result.secure_url);
      }
      const newCampaign = new campaignsModel({
        campaignName,
        description,
        fundTarget,
        startDate,
        endDate,
        thumbnail: thumbnailUrl,
        documentationImages: documentationUrls,
        category,
      });

      await newCampaign.save();

      res.status(201).json({
        message: "New Campaign Created",
        campaign: newCampaign,
      });

      const users = await usersModel.find();
      const notification = users.map((user) => ({
        userId: user._id,
        title: "Kampanye Baru, Dibuka",
        message: `Kampanye ${campaignName} telah dibuka, yuk ikut berdonasi`,
        notificationType: "campaign",
      }));

      await notificationsModel.insertMany(notification);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllCampaign = async (req, res) => {
  try {
    const campaigns = await campaignsModel.find();
    const campaignData = Promise.all(
      campaigns.map(async (campaign) => {
        return {
          campaign: {
            name: campaign.campaignName,
            target: campaign.fundTarget,
            collected: campaign.fundCollected,
            category: campaign.category,
            thumbnail: campaign.thumbnail,
          },
          campaignId: campaign._id,
        };
      })
    );
    res.status(200).json(await campaignData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCampaignDetail = async (req, res) => {
  try {
    const campaignId = req.params.campaignId;
    const campaignData = await campaignsModel.findById(campaignId);
    if (campaignData == null) {
      return res.status(404).json({ message: "cannot find campaign" });
    }
    res.status(200).json(campaignData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const editCampaign = async (req, res) => {
  try {
    const campaignId = req.params.campaignId;
    const campaign = await campaignsModel.findById(campaignId);
    if (!campaign) {
      res.status(400).json({ message: "Campaign not found" });
    }
    const editableFields = [
      "campaignName",
      "description",
      "fundTarget",
      "campaignStatus",
      "startDate",
      "endDate",
      "thumbnail",
      "category",
    ];

    editableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        campaign[field] = req.body[field];
      }
    });

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
      return res
        .status(400)
        .json({ message: "Campaign id is required, but not provided" });
    }

    const deleteCampaign = await campaignsModel.findByIdAndDelete(campaignId);
    if (!deleteCampaign) {
      res.status(400).json({ message: "Campaign not found" });
    }

    return res
      .status(200)
      .json({ message: "campaign succesfully deleted", data: deleteCampaign });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
