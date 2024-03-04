const admin = require("firebase-admin");
const noteModel = require("../models/noteModel");

const createNote = async (req, res) => {
  try {
    const { title, description, attachmentUrl } = req.body;
    const newNote = noteModel({
      title: title,
      description: description,
      attachmentUrl: attachmentUrl,
      userId: req.userId,
    });
    await newNote.save();
    res
      .status(201)
      .json({ message: "Note created successfull", data: { newNote } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Note creation failed" });
  }
};

const updateNote = async (req, res) => {
  try {
    const noteId = req.params.noteId;
    const { title, description, done, attachmentUrl } = req.body;
    const updatedNote = {
      title,
      description,
      done,
      attachmentUrl,
    };
    await noteModel.findByIdAndUpdate(noteId, updatedNote);
    res
      .status(200)
      .json({ message: "Note is updated!", data: { updatedNote } });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

const getNotes = async (req, res) => {
  try {
    const notes = await noteModel.find({ userId: req.userId });
    res.status(200).json(notes);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const deleteNote = async (req, res) => {
  const noteId = req.params.noteId; //noteId is from paramas --> line.no 14 noteRoutes
  try {
    const note = await noteModel.findByIdAndDelete(noteId);
    res.status(202).json(note);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  createNote,
  getNotes,
  updateNote,
  deleteNote,
};
