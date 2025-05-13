import mongoose from "mongoose";

const allocationSchema = new mongoose.Schema({
  allocationDate: {
    type: Date,
    default: Date.now,
  },
  totalAllocated: {
    type: Number,
    required: true,
    min: 0,
  },
  description: {
    type: String,
  },
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Campaign",
  },
});

export default mongoose.model("Allocated", allocationSchema);
