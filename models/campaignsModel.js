import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema({
  campaignName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  fundTarget: {
    type: Number,
    required: true,
  },
  fundCollected: {
    type: Number,
    default: 0,
  },
  campaignStatus: {
    type: String,
    enum: ["Active", "Completed", "Abort"],
    default: "Active",
  },
  startDate: {
    type: Date,
    default: Date.now,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  documentationImages: {
    type: [String],
    default: [],
  },
  category: {
    type: String,
    enum: ["Kesehatan", "Edukasi", "Kemanusiaan", "Lainnya"],
    default: "Lainnya",
  },
  // adminId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Admin",
  // },
});

export default mongoose.model("Campaign", campaignSchema);
