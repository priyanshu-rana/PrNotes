const tagModel = require("../models/tagModel");

const getTagList = async (req, res) => {
  const userId = req.userId;
  try {
    const tags = await tagModel.find({ creatorId: userId });
    res.status(200).json(tags);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message,
      message: "Something went wrong, Unable to fetch Tags !",
    });
  }
};

const createTag = async (req, res) => {
  try {
    const { title } = req.body;
    const newTag = tagModel({
      title: title,
      creatorId: req.userId,
    });
    await newTag.save();
    res
      .status(201)
      .json({ message: "Tag created successfully !", data: { newTag } });
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({ error: error.message, message: "Tag creation failed !" });
  }
};

const deleteTag = async (req, res) => {
  const tagId = req.params.tagId;
  try {
    await tagModel.findByIdAndDelete(tagId);
    res.status(202).json({ message: "Tag deleted successfully !" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: error.message, message: "Something went wrong !" });
  }
};

module.exports = {
  createTag,
  deleteTag,
  getTagList,
};
