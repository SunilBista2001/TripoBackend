import Review from "../models/reviewModel.js";
import AppError from "../utils/appError.js";

export const getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find();

    res.status(200).json({
      status: "success",
      results: reviews.length,
      data: {
        reviews,
      },
    });
  } catch (error) {
    return next(new AppError("No review found", 404));
  }
};

export const addReview = async (req, res, next) => {
  try {
    const newReview = await Review.create({ ...req.body, user: req.user.id });

    res.status(201).json({
      status: "success",
      data: {
        review: newReview,
      },
    });
  } catch (err) {
    return next(
      new AppError("Something went wrong while creating review!!", 400)
    );
  }
};

export const updateReview = async (req, res, next) => {
  try {
    const reviewUpdated = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: "success",
      data: {
        review: reviewUpdated,
      },
    });
  } catch (err) {
    return next(
      new AppError("Something went wrong while updating review!!", 400)
    );
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    await Review.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    return next(new AppError("No review found with that ID", 404));
  }
};
