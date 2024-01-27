import User from "../models/userModel.js";
import Review from "../models/reviewModel.js";
import Tour from "../models/tourModel.js";

const calculateSimilarityMatrix = async (data) => {
  // Getting all the users
  let users = await User.find().select("_id username");

  // Getting all the tours
  let tours = await Tour.find().select("_id name");

  // Getting all the ratings
  let ratings = await Review.find();

  // Mapping data to user, tour, rating format
  const testData = data.map((doc) => {
    const user = doc.user;
    const tour = doc.tour;
    const rating = doc.rating;

    if (!users.includes(user)) users.push(user);
    if (!tours.includes(tour)) tours.push(tour);
  });

  console.log("test data", testData);

  const similarityMatrix = [];

  for (let i = 0; i < users.length; i++) {
    const row = [];
    for (let j = 0; j < users.length; j++) {
      const similarities = [];
      for (let k = 0; k < tours.length; k++) {
        if (ratings[i] && ratings[i][k] && ratings[j] && ratings[j][k]) {
          similarities.push(ratings[i][k] - ratings[j][k]);
        }
      }
      if (similarities.length > 0) {
        const similarity =
          similarities.reduce((acc, cur) => acc + cur) / similarities.length;
        row.push(similarity);
      } else {
        row.push(0);
      }
    }
    similarityMatrix.push(row);
  }

  return similarityMatrix;
};

export const getRecommendation = async (req, res, next) => {
  try {
    // Assuming user is logged in and req.user contains user information
    const userRatings = await Review.find({
      user: req?.user?._id,
    });

    const data = userRatings.map((review) => ({
      user: review.user,
      tour: review.tour,
      rating: review.rating,
    }));

    // Calculate similarity matrix
    const similarityMatrix = await calculateSimilarityMatrix(data);

    res.status(200).json({
      status: "success",
      data: similarityMatrix,
    });
  } catch (error) {
    return next(error);
  }
};
