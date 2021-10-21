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
    const stories = await Story.find({ userId: userId }).lean();
    return ResponseSender.success(res, { stories });
  } catch (err) {
    next(err);
  }
};

const deleteOne = async (req, res, next) => {
  try {
    const data = { ...req.body };
    console.log(data);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const { content } = req.body;
    const data = await cloudinaryUploader(req.file.path, "/picture_stories");
    fs.unlinkSync(req.file.path);
    const story = await Story.create({
      userId: req.user._id,
      content: content,
      imageUrl: data.url,
    });
    return ResponseSender.success(res, { story });
  } catch (err) {
    next(err);
  }
};

const storyController = {
  getMyStories,
  getStoriesByUserId,
  create,
  deleteOne,
};

export default storyController;
