import mongoose from "mongoose";

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A tour must have a name"],
    unique: true,
    trim: true,
    maxlength: [40, "A tour name must have less or equal than 40 characters"],
    minlength: [8, "A tour name must have more or equal than 10 characters"],
  },

  description: {
    type: String,
  },

  duration: {
    type: Number,
    required: [true, "A tour must have a duration"],
  },

  maxGroupSize: {
    type: Number,
    required: [true, "A tour must have a group size"],
  },

  difficulty: {
    type: String,
    required: [true, "A tour must have a difficulty"],
  },

  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, "Rating must be above 1.0"],
    max: [5, "Rating must be below 5.0"],
  },

  profilePicture: {
    type: String,
  },

  images: [String],

  price: {
    type: Number,
    required: [true, "A tour must have a price"],
  },
});

const Tour = mongoose.model("Tour", tourSchema);

export default Tour;
