const express = require("express");
const router = express.Router();
const { handleContactForm } = require("../controllers/externalController");
const { verifyExternalRequest } = require("../middlewares/externalAuth");

router.post("/external", verifyExternalRequest, handleContactForm);

module.exports = router;
