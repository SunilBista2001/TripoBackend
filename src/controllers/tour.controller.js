import multer from "multer";
import Tour from "../models/tourModel.js";
import AppError from "../utils/appError.js";
import sharp from "sharp";

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

export const uploadTourImages = upload.fields([
  { name: "coverImage", maxCount: 1 },
  { name: "images", maxCount: 3 },
]);

export const resizeTourImages = async (req, res, next) => {
  if (!req.files.coverImage || !req.files.images) return next();

  // 1) Cover image

  req.body.coverImage = `tour-${req.params.id}-${Date.now()}.jpeg`;

  await sharp(req.files.coverImage[0].buffer)
    .resize(2000, 1333)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`img/tours/${req.body.coverImage}`);

  // 2) Images

  req.body.images = [];

  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`img/tours/${filename}`);

      req.body.images.push(filename);
    })
  );

  next();
};

export const getAllTours = async (req, res, next) => {
  try {
    const tours = await Tour.find();

    res.status(200).json({
      status: "success",
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getTourById = async (req, res, next) => {
  try {
    const tour = await Tour.findById(req.params.id).populate("reviews");

    if (!tour) {
      return next(new AppError("No tour found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createTour = async (req, res, next) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const updateTourById = async (req, res, next) => {
  try {
    const updateTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      data: {
        tour: updateTour,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const deleteTour = async (req, res, next) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    next(err);
  }
};
