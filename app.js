import express from "express";
import morgan from "morgan";
import config from "./src/configs/config.js";
import connectDB from "./src/configs/db.js";
import routes from "./src/routes/index.js";
import AppError from "./src/utils/appError.js";
import { errorHandler } from "./src/middleware/error.middleware.js";

const app = express();

// To log the request
app.use(morgan("dev"));

// To parse the body of the request
app.use(express.json());

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

app.use("*", (req, res, next) => {
  return next(new AppError("Route not found", 404));
});

// To listen on server
app.listen(config.port, () => {
  console.log("Server is running on port 3000");
});

// Global error handler
app.use(errorHandler);

export default app;
