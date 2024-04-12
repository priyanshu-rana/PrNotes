const express = require("express");
const auth = require("../middlewares/auth");
const {
  createTag,
  deleteTag,
  getTagList,
  deleteTags,
} = require("../controllers/tagController");

const tagRouter = express.Router();

tagRouter.post("/", auth, createTag);
tagRouter.get("/tag-list", auth, getTagList);
tagRouter.delete("/delete-tags", auth, deleteTags);
tagRouter.delete("/:tagId", auth, deleteTag);

module.exports = tagRouter;
