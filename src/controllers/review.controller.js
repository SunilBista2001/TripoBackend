import Review from "../models/reviewModel.js";
import AppError from "../utils/appError.js";

export const getAllReviews = async (req, res, next) => {
  try {
    let filter = {};

    if (req.params.tourId) filter = { tour: req.params.tourId };

    const reviews = await Review.find(filter);

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
  const tourId = req?.params?.tourId;

  try {
    const review = await Review.findOne({ tour: tourId, user: req.user.id });

    // if user has already review on this tour, don't create a review
    if (review) {
      return next(new AppError("You already reviewed this tour", 400));
    }

    const newReview = await Review.create({
      ...req.body,
      user: req.user.id,
      tour: tourId,
    });

    res.status(201).json({
      status: "success",
      data: {
        review: newReview,
      },
    });
  } catch (err) {
    next(err);
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
    next(err);
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
    next(error);
  }
};
