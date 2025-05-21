// import reportsModel from "../models/reportsModel.js";
import reportsModel from "../models/reportsModel.js";

export const createReport = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res
        .status(400)
        .json({ message: "Please fill all required fields" });
    } else {
      const newReport = new reportsModel({
        title,
      });

      await newReport.save();

      return res.status(201).json({
        message: "New Report created",
        report: newReport,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
