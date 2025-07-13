const express = require("express");
const auth = require("../middlewares/auth");
const secretRouter = express.Router();
const { encryptNote, decryptNote } = require("../controllers/secretController");

secretRouter.post("/encrypt/:noteId", auth, encryptNote);
secretRouter.post("/decrypt/:noteId", auth, decryptNote);

module.exports = secretRouter;
