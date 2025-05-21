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
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
    validate: {
      validator: function (v) {
        return v > this.startDate;
      },
      message: "End date must be after start date",
    },
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

  // Informasi metode transfer
  bankInfo: {
    bankName: {
      type: String,
      required: true,
    },
    accountNumber: {
      type: String,
      required: true,
    },
    accountName: {
      type: String,
      required: true,
    },
    bankCode: {
      type: String,
      required: true,
    },
  },

  // Informasi contact person
  contactPerson: {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
});

export default mongoose.model("Campaign", campaignSchema);
