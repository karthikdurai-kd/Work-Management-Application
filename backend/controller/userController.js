// User Controller

const bcryptjs = require("bcryptjs");
const User = require("../model/User");
const appErr = require("../utils/appErr");
const createJWTToken = require("../utils/createJWTToken");

// User Register Controller
const userRegisterController = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    // Step-1: Check whether user email exits or not
    const userFound = await User.findOne({ email });
    if (userFound) {
      // Creating error object using "appErr.js" file
      const userFoundErrObject = appErr("User already exists", 400);
      return next(userFoundErrObject); // control will be transferred to express error handler [globalErrorHandler.js file]
    }

    // Step-2: Hash the password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt); // Hashing the password using "bcrptjs" library

    // Step-3: Save the user in database
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    // Step-4: Send the reponse to front-end
    res.status(201).json({
      // Backend API Response Format - https://chat.openai.com/share/c2089d08-229f-49ec-a307-57e3a42c1a44
      status: "success",
      message: "User Registered successfully",
    });
  } catch (err) {
    const errObj = appErr(err, 500);
    next(errObj);
  }
};

// User Login Controller
const userLoginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // Step-1: Check if email ID exists or not
    const userFound = await User.findOne({ email });
    if (!userFound) {
      const userNotFoundErrObj = appErr("Invalid Credentials", 400);
      return next(userNotFoundErrObj);
    }
    // Step-2: Compare the user provided password with hashed password from Database
    const passwordMatched = await bcryptjs.compare(
      password,
      userFound.password
    );
    if (!passwordMatched) {
      const userNotFoundErrObj = appErr("Invalid Credentials", 400);
      return next(userNotFoundErrObj);
    }
    // Step-3: Generate JWT Token
    const token = createJWTToken(userFound._id);
    // Step-4: Send the response to the user
    res.status(200).json({
      // Backend API Response Format - https://chat.openai.com/share/c2089d08-229f-49ec-a307-57e3a42c1a44
      status: "success",
      message: "User Login Successfully",
      data: token,
    });
  } catch (err) {
    const errObj = appErr(err, 500);
    next(errObj);
  }
};

// User Profile View Controller
const userProfileViewController = async (req, res, next) => {
  try {
    const userID = req.userID; // "req.userID" is appended by auth middleware
    // Step-1: Check the user with userID appended by authMiddleware
    const userFound = await User.findById(userID);
    if (!userFound) {
      const userNotFoundErrObj = appErr("User does not exist", 400);
      return next(userNotFoundErrObj);
    }
    // Step-2: Send the response to the front-end
    const { password, ...filterdUserData } = userFound.toObject(); // Here we are filtering password from "userFound" that we got from Database
    res.status(200).json({
      status: "success",
      message: "User Profile fetched successfully",
      data: filterdUserData,
    });
  } catch (err) {
    const errObj = appErr(err, 500);
    next(errObj);
  }
};

module.exports = {
  userRegisterController,
  userLoginController,
  userProfileViewController,
};
