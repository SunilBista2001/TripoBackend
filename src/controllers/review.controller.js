import Review from "../models/reviewModel.js";

export const getAllReviews = async (req, res, next) => {
  try {
    // getting all reviews and populating the user and tour fields
    const reviews = await Review.find()
      .populate({
        path: "user",
        select: "username",
      })
      .populate({
        path: "tour",
        select: "name",
      })
      .select("-__v");

    res.status(200).json({
      status: "success",
      results: reviews.length,
      data: {
        reviews,
      },
    });
  } catch (error) {
    next(error);
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
    next(err);
  }
};
