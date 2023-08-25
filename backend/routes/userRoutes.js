// This is User Routes

const userRouter = require("express").Router();
const {
  userRegisterController,
  userLoginController,
  userProfileViewController,
} = require("../controller/userController");
const authMiddleware = require("../middlewares/authMiddleware");

// User Base API Route - /api/users

// Register API -> POST: /register
userRouter.post("/register", userRegisterController);

// Login API ->  POST: /login
userRouter.post("/login", userLoginController);

// User Profile View API -> GET: /user-profile
userRouter.get("/profile", authMiddleware, userProfileViewController);

module.exports = userRouter;
