import mongoose from "mongoose";

import config from "./config.js";

const connectDB = mongoose.connect(config.mongo_uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export default connectDB;
