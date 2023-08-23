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

const upload = multer({ storage: storage });

noteRouter.use("/image", express.static("./uploads"));
noteRouter.post("/", auth, upload.single("image"), createNote);
noteRouter.get("/", auth, getNotes);
noteRouter.put("/:noteId", auth, updateNote);
noteRouter.delete("/:noteId", auth, deleteNote);

module.exports = noteRouter;
