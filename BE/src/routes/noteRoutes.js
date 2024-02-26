const express = require("express");
const multer = require("multer");
const auth = require("../middlewares/auth");

const {
  createNote,
  getNotes,
  updateNote,
  deleteNote,
} = require("../controllers/noteController");

const noteRouter = express.Router();
const storage = multer.memoryStorage();

//TODO: Remove uplaod as we are not using multer now and modify Update API accordingly
const upload = multer({
  storage: storage,
});
const imageUpload = upload.single("image");

noteRouter.post("/", auth, createNote);
noteRouter.get("/", auth, getNotes);
noteRouter.put("/:noteId", auth, imageUpload, updateNote); // TODO: Modify Update Note API as per Attachment & Check when Updating attachement related prevously updated attachment must delete/remove from the firebase storage/bucket
noteRouter.delete("/:noteId", auth, deleteNote);

module.exports = noteRouter;
