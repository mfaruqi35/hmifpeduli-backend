import Report from "../models/reportsModel.js";
import Campaign from "../models/campaignsModel.js";

export const createReport = async (req, res) => {
  try {
    const { campaignId, allocations } = req.body;

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ message: "Campaign tidak ditemukan" });
    }

    const totalIncomingDonations = campaign.fundCollected;

    // Hitung total alokasi dari semua laporan sebelumnya
    const existingReports = await Report.find({ campaignId });
    const usedAllocation = existingReports.reduce((sum, report) => sum + report.totalAllocatedFunds, 0);

    const newAllocation = allocations.reduce((sum, alloc) => sum + alloc.amount, 0);
    const remainingBalance = totalIncomingDonations - usedAllocation;

    if (newAllocation > remainingBalance) {
      return res.status(400).json({
        message: "Total alokasi melebihi saldo tersedia dari donasi yang masuk",
        allowedMaxAllocation: remainingBalance,
      });
    }

    const balance = remainingBalance - newAllocation;

    const report = new Report({
      campaignId,
      campaignName: campaign.campaignName,
      description: campaign.description,
      startDate: campaign.startDate,
      endDate: campaign.endDate,
      category: campaign.category,
      bankInfo: campaign.bankInfo,
      contactPerson: campaign.contactPerson,
      campaignImages: campaign.pictures, 
      totalIncomingDonations,
      totalAllocatedFunds: newAllocation,
      balance,
      allocations,
      reportStatus: campaign.campaignStatus,
    });

    await report.save();

    // // Update status donasi menjadi "Selesai"
    // await Donation.updateMany(
    //   { campaignId, donationStatus: { $ne: "Successful" } },
    //   { $set: { donationStatus: "Successful" } }
    // );

    // ✅ Tambahkan: ubah status campaign jika saldo habis
    if (balance === 0) {
      campaign.campaignStatus = "Completed";
      await campaign.save();
    }

    res.status(201).json(report);
  } catch (error) {
    console.error("Gagal membuat laporan:", error); // tambahkan log ini untuk debug cepat
    res.status(500).json({ message: "Gagal membuat laporan", error });
  }
};

export const getReportsByCampaign = async (req, res) => {
  try {
    const { campaignId } = req.params;
    const reports = await Report.find({ campaignId }).sort({ reportDate: -1 });
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil laporan", error });
  }
};

export const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find().sort({ reportDate: -1 });
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil semua laporan", error });
  }
};

export const updateReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { allocations } = req.body;

    const report = await Report.findById(id);
    if (!report) {
      return res.status(404).json({ message: "Laporan tidak ditemukan" });
    }

    const campaign = await Campaign.findById(report.campaignId);
    if (!campaign) {
      return res.status(404).json({ message: "Campaign tidak ditemukan" });
    }

    const totalIncomingDonations = campaign.fundCollected;

    // Hitung total alokasi dari semua laporan, kecuali laporan ini sendiri
    const otherReports = await Report.find({ campaignId: report.campaignId, _id: { $ne: id } });
    const usedAllocation = otherReports.reduce((sum, r) => sum + r.totalAllocatedFunds, 0);

    const newAllocation = allocations.reduce((sum, alloc) => sum + alloc.amount, 0);
    const remainingBalance = totalIncomingDonations - usedAllocation;

    if (newAllocation > remainingBalance) {
      return res.status(400).json({
        message: "Total alokasi melebihi saldo tersedia dari donasi yang masuk",
        allowedMaxAllocation: remainingBalance,
      });
    }

    const balance = remainingBalance - newAllocation;

    report.totalIncomingDonations = totalIncomingDonations;
    report.totalAllocatedFunds = newAllocation;
    report.balance = balance;
    report.allocations = allocations;
    report.reportDate = Date.now();

    await report.save();

    if (balance === 0) {
      campaign.campaignStatus = "Completed";
      report.reportStatus = "Completed";
    } else {
      campaign.campaignStatus = "Active";
      report.reportStatus = "Active";
    }

    await report.save();
    await campaign.save();


    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengupdate laporan", error });
  }
};

export const getReportById = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await Report.findById(id);

    if (!report) {
      return res.status(404).json({ message: "Laporan tidak ditemukan" });
    }

    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil laporan", error });
  }
};
