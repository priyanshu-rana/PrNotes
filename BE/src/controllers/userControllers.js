require("dotenv").config();
const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const SECRET_KEY = process.env.SECRET_KEY;
const RESET_SECRET_KEY = process.env.RESET_SECRET_KEY;

const signUp = async (req, res) => {
  const { first_name, last_name, password, email } = req.body;

  try {
    const existingUser = await userModel.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = await userModel.create({
      email: email,
      password: hashedPassword,
      first_name: first_name,
      last_name: last_name,
    });

    const token = jwt.sign(
      { email: createdUser.email, id: createdUser._id },
      SECRET_KEY
    );

    res.status(201).json({ user: createdUser, token: token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await userModel.findOne({ email: email });

    if (!existingUser) {
      return res
        .status(404)
        .json({ message: "Unable to find your account with this Email !" });
    }

    const matchPassword = await bcrypt.compare(password, existingUser.password);

    if (!matchPassword) {
      return res.status(404).json({ message: "Invalid Password !" });
    }

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      SECRET_KEY
    );

    res.status(200).json({ user: existingUser, token: token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const existingUser = await userModel.findOne({ email: email });
    if (!existingUser) {
      return res.status(404).json({
        message: "Unable to find account with provided Email!",
      });
    }

    // Generate JWT token with expiration
    const resetToken = jwt.sign({ id: existingUser._id }, RESET_SECRET_KEY, {
      expiresIn: "10m",
    });

    // Send email with reset link
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetLink = `${process.env.FE_URL}/reset-password?token=${resetToken}`;
    try {
      await transporter.sendMail({
        to: email,
        subject: "Password Reset",
        html: `<p>You requested a password reset. Click <a href="${resetLink}">here</a> to reset you password.
        The link expires in 10 minutes.
        </p>`,
      });
      res.status(200).json({
        message: "Password reset link send to your email.",
      });
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      return res
        .status(500)
        .json({ message: "Failed to send email. Please try again." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = { signUp, signIn, forgotPassword };
