import mongoose from "mongoose";
import Tour from "./tourModel.js";

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: [true, "Review can not be empty!"],
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },

  // parent referencing
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: "Tour",
    required: [true, "Review must belong to a tour."],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Review must belong to a user."],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

// populate the user field with the username and profilePicture
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "username profilePicture ",
  });
  next();
});

reviewSchema.statics.calcAvgRating = async function (tourId) {
  console.log("id=>", tourId);

  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: "$tour",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  await Tour.findByIdAndUpdate(tourId, {
    ratingsQuantity: stats[0].nRating,
    ratingsAverage: stats[0].avgRating,
  });
};

reviewSchema.post("save", function () {
  this.constructor.calcAvgRating(this.tour);
});

const Review = mongoose.model("Review", reviewSchema);

export default Review;
