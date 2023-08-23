const noteModel = require("../models/noteModel");
// CRUD --> Create, Read, Update, Delete

const createNote = async (req, res) => {
  const { title, description } = req.body;
  const file = req.file;
  const fileName = file?.filename;

  const newNote = new noteModel({
    //what is new keyword in js
    title: title,
    description: description,
    userId: req.userId,
    image: `http://localhost:5000/note/image/${fileName}`, //TODO -> add baseurl in place of loacal server
  });
  try {
    await newNote.save();
    res.status(201).json(newNote);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
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

const updateNote = async (req, res) => {
  const noteId = req.params.noteId; //noteId is from paramas --> line.no 13 noteRoute
  const { title, description, done } = req.body;

  const newNote = {
    title: title,
    description: description,
    done: done,
    userId: req.id,
  };

  try {
    await noteModel.findByIdAndUpdate(noteId, newNote, { new: true });
    res.status(200).json(newNote);
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

module.exports = { createNote, getNotes, updateNote, deleteNote };
