import config from "../configs/config.js";

const sendErrToDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrToProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.log("ERROR: ", err);
    res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    });
  }
};

export const errorHandler = (err, req, res, next) => {
  console.log("error handler", err);

  if (config.node_env === "development") {
    sendErrToDev(err, res);
  }

  if (config.node_env === "production") {
    let err = { ...err };
    sendErrToProd(err, res);
  }
};
