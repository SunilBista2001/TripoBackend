import User from "../models/userModel.js";
import Review from "../models/reviewModel.js";
import AppError from "../utils/appError.js";
import Tour from "../models/tourModel.js";

export const getCollaborativeRecommendation = async (req, res, next) => {
  try {
    // Getting user
    const user = await User.findById(req.user.id)
      .select("-password -__v")
      .populate("reviews");

    // Getting similar users id who have reviewed the same tours
    const similarUsers = await Review.find({
      tour: { $in: user.reviews.map((review) => review.tour) },
      user: {
        $ne: user._id, // exclude current user
      },
    }).distinct("user");

    // if user has no reviews and no similar users
    if (user.reviews.length === 0) {
      // Filtering out tours with ratingsAverage greater than or equals to 3
      const popularTours = await Tour.find({
        ratingsAverage: { $gte: 3 },
      })
        .sort("-ratingsAverage")
        .select("-__v");

      res.status(200).json({
        status: "success",
        results: popularTours.length,
        data: {
          recommendation: popularTours,
        },
      });
    }

    // Getting Tours id based on similar users who have reviewed another tour also
    const Tours = await Review.find({
      user: { $in: similarUsers },
    })
      .sort("-createdAt")
      .distinct("tour");

    console.log("tours", Tours);

    // Getting Tours details
    const recommendation = await Tour.find({
      _id: { $in: Tours },
    }).select("-__v");

    res.status(200).json({
      status: "success",
      results: recommendation.length,
      data: {
        recommendation,
      },
    });
  } catch (error) {
    return next(new AppError("Error getting recommendation", 500));
  }
};
