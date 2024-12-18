const express = require("express");
const { generateSignedUrl } = require("../controllers/fileController");
const auth = require("../middlewares/auth");

const fileRouter = express.Router();
fileRouter.post("/signed-url", auth, generateSignedUrl);

module.exports = fileRouter;
