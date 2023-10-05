import User from "../models/userModel.js";
import AppError from "../utils/appError.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password -__v");
    res.status(200).json({
      status: "success",
      data: { users },
    });
  } catch (error) {
    return next(new AppError("Error getting all users", 500));
  }
};
