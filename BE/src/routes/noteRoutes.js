const express = require("express");
const multer = require("multer");
const {
  createNote,
  getNotes,
  updateNote,
  deleteNote,
} = require("../controllers/noteController");
const auth = require("../middlewares/auth");
const noteRouter = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  //  limits: { fileSize: 1000 }
});
const imageUpload = upload.single("image");

noteRouter.use("/image", express.static("./uploads"));
noteRouter.post("/", auth, upload.single("image"), createNote);
noteRouter.get("/", auth, getNotes);
noteRouter.put("/:noteId", auth, imageUpload, updateNote);
noteRouter.delete("/:noteId", auth, deleteNote);

module.exports = noteRouter;
