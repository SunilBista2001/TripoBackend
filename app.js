import express from "express";
import morgan from "morgan";
import config from "./src/configs/config.js";
import connectDB from "./src/configs/db.js";
import routes from "./src/routes/index.js";
import AppError from "./src/utils/appError.js";
import { errorHandler } from "./src/middleware/error.middleware.js";
import compression from "compression";
import cors from "cors";
import appRoot from "app-root-path";

const app = express();

// To log the request
app.use(morgan("dev"));

const whitelist = ["http://localhost:5173", "http://localhost:3000"];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

// To parse the body of the request
app.use(express.json());

// static route ./img
app.use(express.static(appRoot + "/img"));

// To compress the response
app.use(compression());

// Connect to MongoDB
connectDB
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.log("Error connecting to the database:", err);
  });

// To handle the routes
app.use("/api/v1", routes);

// app.use("*", (req, res, next) => {
//   return next(new AppError("Route not found", 404));
// });

// Global error handler
app.use(errorHandler);

// To listen on server
app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});

export default app;
