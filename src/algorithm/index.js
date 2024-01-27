import User from "../models/userModel.js";
import Review from "../models/reviewModel.js";
import Tour from "../models/tourModel.js";

export const getCollaborativeRecommendation = async (req, res, next) => {
  try {
    // Getting user
    const user = await User.findById(req.user.id)
      .select("-password -__v")
      .populate("reviews");

    // if user has no reviews
    if (user.reviews.length === 0) {
      const tours = await Tour.find({
        ratingsAverage: { $gte: 3 },
      }).sort("-ratingsAverage");

      return res.status(200).json({
        status: "success",
        results: tours.length,
        data: {
          recommendation: tours,
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

    // Getting Tours id based on similar users who have reviewed another tour also
    const Tours = await Review.find({
      user: { $in: similarUsers },
    })
      .sort("-createdAt")
      .distinct("tour");

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
    return next(error);
  }
};
