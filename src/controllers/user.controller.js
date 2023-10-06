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

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password -__v");

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: { user },
    });
  } catch (err) {
    return next(new AppError("Error getting user", 500));
  }
};
