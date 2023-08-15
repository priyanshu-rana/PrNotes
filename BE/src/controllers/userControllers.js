require("dotenv").config();
const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY;

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

module.exports = { signUp, signIn };
