import { cloudinaryUploader } from "../../config/cloudiary.config";
import ResponseSender from "../../helper/response.helper";
import User from "../User/user.model";
import Story from "./story.model";
import fs from "fs";

const getMyStories = async (req, res, next) => {
  try {
    const myId = req.user._id;
    const me = await User.findById(myId).lean();
    const stories = await Story.find({ userId: me._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("owner")
      .lean();

    return ResponseSender.success(res, { stories });
  } catch (err) {
    next(err);
  }
};

const getStoriesByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;
    let stories = await Story.find({ userId: userId }).lean();
    if (1) stories = stories.filter((i) => i.isPrivate === false);

    console.log(stories);
    return ResponseSender.success(res, { stories });
  } catch (err) {
    next(err);
  }
};

const deleteOne = async (req, res, next) => {
  try {
    const { storyId } = req.params;
    await Story.findOneAndRemove({ _id: storyId, userId: req.user._id });
    return ResponseSender.success(res, { message: "success" });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const { content, isPrivate } = req.body;
    const data = await cloudinaryUploader(req.file.path, "/picture_stories");
    fs.unlinkSync(req.file.path);
    const newItem = await Story.create({
      userId: req.user._id,
      content: content,
      imageUrl: data.url,
      isPrivate,
    });
    const story = await Story.findById(newItem._id).populate("owner").lean();
    return ResponseSender.success(res, { story });
  } catch (err) {
    next(err);
  }
};

const updateOne = async (req, res, next) => {
  try {
    const { storyId } = req.params;
    const data = { ...req.body };
    const story = await Story.findOneAndUpdate(
      { _id: storyId, userId: req.user._id },
      {
        isPrivate: data.isPrivate,
        imageUrl: data.imageUrl,
      },
      { new: true }
    );
    if (story === null)
      return ResponseSender.error(
        res,
        { message: "Unauthorized to update this story" },
        403
      );
    else return ResponseSender.success(res, { story });
  } catch (error) {
    next(error);
  }
};

const storyController = {
  getMyStories,
  getStoriesByUserId,
  create,
  updateOne,
  deleteOne,
};

export default storyController;
