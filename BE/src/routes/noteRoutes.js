const express = require("express");
const auth = require("../middlewares/auth");

const {
  createNote,
  getNotes,
  updateNote,
  deleteNote,
} = require("../controllers/noteController");

const noteRouter = express.Router();

noteRouter.post("/", auth, createNote);
noteRouter.get("/", auth, getNotes);
noteRouter.put("/:noteId", auth, updateNote); // TODO: Modify Update Note API as per Attachment & Check when Updating attachement related prevously updated attachment must delete/remove from the firebase storage/bucket
noteRouter.delete("/:noteId", auth, deleteNote);

module.exports = noteRouter;
