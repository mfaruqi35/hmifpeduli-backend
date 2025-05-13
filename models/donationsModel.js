import mongoose from "mongoose";

const donationSchema = new mongoose.Schema({
  donaturName: {
    type: String,
    default: "Orang Berjasa",
  },
  amount: {
    type: Number,
    required: true,
  },
  donaturId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Campaign",
  },
  donationDate: {
    type: Date,
    default: Date.now,
  },
  donationStatus: {
    type: String,
    enum: ["Pending", "Successful", "Abort"],
    default: "Pending",
  },
  paymentMethod: {
    type: String,
    enum: ["BCA", "BSI", "Mandiri", "Dana", "Ovo", "Gopay"],
    required: true,
  },
  proofImage: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Donation", donationSchema);
