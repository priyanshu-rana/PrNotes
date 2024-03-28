const express = require("express");
const auth = require("../middlewares/auth");
const {
  createTag,
  deleteTag,
  getTagList,
} = require("../controllers/tagController");

const tagRouter = express.Router();

tagRouter.post("/", auth, createTag);
tagRouter.get("/list", auth, getTagList);
tagRouter.delete("/:tagId", auth, deleteTag);

module.exports = tagRouter;
