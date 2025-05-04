const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    default: null,
    trim: true,
  },
  totalDonasi: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  historiDonasi: [
    {
      tanggal: { type: Date, default: null },
      jumlahDonasi: { type: Number, default: 0 },
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
