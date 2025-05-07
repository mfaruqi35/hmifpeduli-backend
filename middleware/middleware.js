import jwt from "jsonwebtoken";
import usersModel from "../models/usersModel.js";
import adminsModel from "../models/adminsModel.js";

export const authUser = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res
        .status(401)
        .json({ message: "Not authorized, no token provided!" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.type || decoded.type !== "user") {
      res.status(401).json({ message: "Invalid token type" });
    }

    req.user = await usersModel.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token." });
  }
};

export const authAdmin = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res
        .status(401)
        .json({ message: "Not authorized, no token provided!" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.type || decoded.type !== "admin") {
      res.status(401).json({ message: "Invalid token type" });
    }

    req.admin = await adminsModel.findById(decoded.id).select("-password");

    if (!req.admin) {
      return res.status(401).json({ message: "Admin not found" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token." });
  }
};
