const express = require("express");
const {
  createNote,
  getNotes,
  updateNote,
  deleteNote,
} = require("../controllers/noteController");
const auth = require("../middlewares/auth");
const noteRouter = express.Router();

noteRouter.post("/", auth, createNote);
noteRouter.get("/", auth, getNotes);
noteRouter.put("/:noteId", auth, updateNote);
noteRouter.delete("/:noteId", auth, deleteNote);

module.exports = noteRouter;
