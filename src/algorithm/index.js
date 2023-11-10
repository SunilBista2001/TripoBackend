import User from "../models/userModel.js";
import Review from "../models/reviewModel.js";
import AppError from "../utils/appError.js";
import Tour from "../models/tourModel.js";

export const getCollaborativeRecommendation = async (req, res, next) => {
  try {
    // const userId = req.user.id;

    // Getting user
    const user = await User.findById(req.params.id)
      .select("-password -__v")
      .populate("reviews");

    console.log("user", user);

    // if user has no reviews
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

    // Getting similar users id who have reviewed the same tours
    const similarUsers = await Review.find({
      tour: { $in: user.reviews.map((review) => review.tour) },
      user: {
        $ne: user._id, // exclude current user
      },
    }).distinct("user");

    // Getting Tours id based on similar users
    const Tours = await Review.find({
      user: { $in: similarUsers },
    })
      .sort("-createdAt")
      .distinct("tour");

    // Getting recommended tours
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
