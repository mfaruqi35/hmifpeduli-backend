import notificationsModel from "../models/notificationsModel.js";
import usersModel from "../models/usersModel.js";

export const createNotification = async (req, res) => {
  try {
    const { userId, title, message, notificationType } = req.body;

    const notification = await notificationsModel.create({
      userId,
      title,
      message,
      notificationType,
    });

    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserNotification = async (req, res) => {
  try {
    const notification = await notificationsModel
      .find({
        userId: req.user._id,
      })
      .sort({ createdAt: -1 });
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await notificationsModel.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    await notificationsModel.updateMany(
      { userId: req.user._id, isRead: false },
      { isRead: true }
    );
    res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await notificationsModel.findOneAndDelete({
      _id: id,
      userId: req.user._id,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json({ message: "Notification successfully deleted" });
  } catch (error) {
    res.status(500).json({ messge: error.message });
  }
};
