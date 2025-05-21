import Donation from "../models/donationsModel.js";
import Campaign from "../models/campaignsModel.js";

export const createDonation = async (req, res) => {
  const { amount, paymentMethod, campaignId, proof, donaturName: clientName } = req.body;

  try {
    // Validasi field wajib
    if (!amount || !paymentMethod || !campaignId || !proof) {
      return res.status(400).json({ message: "Semua field wajib diisi." });
    }

    // Validasi nilai amount (harus positif)
    if (amount <= 0) {
      return res.status(400).json({ message: "Jumlah donasi harus lebih dari 0." });
    }

    // Validasi campaign ID
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ message: "Kampanye tidak ditemukan." });
    }

    // Donatur default
    let donaturName = "Orang Baik";
    let donaturId = null;

    // Ambil dari user login (kalau ada)
    if (req.user) {
      donaturName = req.user.name;
      donaturId = req.user._id;
    } else if (clientName) {
      // Jika tidak login, gunakan nama dari frontend
      donaturName = clientName;
    }

    const newDonation = new Donation({
      donaturName,
      amount,
      donaturId,
      campaignId,
      paymentMethod,
      proof,
    });

    await newDonation.save();

    res.status(201).json({
      message: "Donasi berhasil dibuat!",
      donation: newDonation,
    });

  } catch (error) {
    console.error("Gagal membuat donasi:", error);
    res.status(500).json({ message: "Terjadi kesalahan saat memproses donasi." });
  }
};


export const getDonationsByCampaign = async (req, res) => {
  const { campaignId } = req.params;

  try {
    const donations = await Donation.find({ campaignId });
    
    res.status(200).json({
      message: "Donasi berhasil ditemukan",
      donations,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan saat mengambil donasi." });
  }
};

export const verifyDonationStatus = async (req, res) => {
  const { donationId } = req.params;
  const { status } = req.body; // Expected: "Successful" or "Abort"

  try {
    // Validasi input
    if (!["Successful", "Abort"].includes(status)) {
      return res.status(400).json({ message: "Status harus 'Successful' atau 'Abort'" });
    }

    const donation = await Donation.findById(donationId);
    if (!donation) {
      return res.status(404).json({ message: "Donasi tidak ditemukan" });
    }

    // Jangan proses ulang donasi yang sudah diverifikasi
    if (donation.donationStatus !== "Pending") {
      return res.status(400).json({ message: "Donasi sudah diverifikasi sebelumnya" });
    }

    donation.donationStatus = status;

    // Jika sukses, tambahkan ke fundCollected di campaign terkait
    if (status === "Successful") {
      const campaign = await Campaign.findById(donation.campaignId);
      if (!campaign) {
        return res.status(404).json({ message: "Kampanye terkait tidak ditemukan" });
      }

      campaign.fundCollected += donation.amount;
      await campaign.save();
    }

    await donation.save();

    res.status(200).json({
      message: `Donasi telah diverifikasi sebagai ${status}`,
      donation,
    });
  } catch (error) {
    console.error("Verifikasi gagal:", error);
    res.status(500).json({ message: "Terjadi kesalahan saat verifikasi donasi" });
  }
};

export const getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find()
      .sort({ createdAt: -1 })
      .populate("campaignId", "campaignName"); // hanya ambil campaignName dari campaign terkait

    res.status(200).json(donations);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data donasi." });
  }
};

