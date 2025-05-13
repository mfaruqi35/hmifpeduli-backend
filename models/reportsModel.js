import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  title: {
    type: Number,
    required: true,
  },
  totalIncomingDonations: {
    type: Number,
    default: 0,
  },
  totalAllocatedFunds: {
    type: Number,
    default: 0,
  },
  balance: {
    type: Number,
    default: 0,
    min: 0,
  },
  reportDate: {
    type: Date,
    default: Date.now,
  },
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Campaign",
  },
});

export default mongoose.model("Report", reportSchema);
