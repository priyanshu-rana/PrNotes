const express = require("express");
const {
  signUp,
  signIn,
  forgotPassword,
} = require("../controllers/userControllers");
const userRouter = express.Router();

userRouter.post("/signup", signUp);

userRouter.post("/signin", signIn);

userRouter.post("/forgot-password", forgotPassword);

module.exports = userRouter;
