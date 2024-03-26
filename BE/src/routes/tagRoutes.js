const express = require("express");
const auth = require("../middlewares/auth");
const { createTag, deleteTag } = require("../controllers/tagController");

const tagRouter = express.Router();

tagRouter.post("/", auth, createTag);
tagRouter.delete("/:tagId", auth, deleteTag);

module.exports = tagRouter;
