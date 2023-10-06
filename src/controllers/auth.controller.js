import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import AppError from "../utils/appError.js";

const generateToken = (id) =>
  jwt.sign({ id }, "my-secret-key", {
    expiresIn: "1d",
  });

export const register = async (req, res, next) => {
  try {
    // santizing the user role to prevent any malicious code and to make sure that the user role is user only
    const user = await User.create({ ...req.body, role: "user" });

    // generate a token
    const token = generateToken(user._id);

    res.status(201).json({
      status: "success",
      token,
    });
  } catch (error) {}
};

export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError("Please provide email and password!", 400));
    }

    const user = await User.find({ email }).select("+password");

    if (!user || !(await bcrypt.compare(password, user[0]?.password))) {
      return next(new AppError("Incorrect email or password", 401));
    }

    // generate a token
    const token = generateToken(user[0]._id);

    res.status(200).json({
      status: "success",
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const requireAuth = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(
        new AppError("You are not logged in! Please log in to get access.", 401)
      );
    }

    // 2) Verification token
    const decodedToken = jwt.verify(token, "my-secret-key");

    // 3) Check if user still exists
    const currentUser = await User.findById(decodedToken.id);

    if (!currentUser) {
      return next(
        new AppError(
          "The user belonging to this token does no longer exist.",
          401
        )
      );
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;

    next();
  } catch (error) {}
};

export const authorizeTo = (role) => {
  return (req, res, next) => {
    if (!role.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};

export const getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};
