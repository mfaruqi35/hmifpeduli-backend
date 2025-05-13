import allocationsModel from "../models/allocationsModel.js";
import campaignsModel from "../models/campaignsModel.js";

export const createAllocation = async (req, res) => {
  try {
    const { campaignId, totalAllocated, description } = req.body;
    if ((!campaignId, !totalAllocated, !description)) {
      res.status(400).json({ message: "Please fill all required fields" });
    }

    const campaign = await campaignsModel.findById(campaignId);
    if (!campaign) {
      return res.status(400).json({ message: "Campaign not found" });
    }

    if (totalAllocated > campaign.fundCollected) {
      res
        .status(400)
        .json({ message: "total Allocated exceeds campaign fund" });
    }
    const newAllocation = new allocationsModel({
      campaignId,
      totalAllocated,
      description,
    });

    await newAllocation.save();

    return res.status(201).json({
      message: "New allocation created",
      allocation: newAllocation,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllocationsByCampaign = async (res, req) => {
  try {
    const { campaignId } = req.params;
    const allocations = await allocationsModel
      .find({ campaignId })
      .sort({ allocationDate: -1 });

    res.status(200).json({ allocations });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
