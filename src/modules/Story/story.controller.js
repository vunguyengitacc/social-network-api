import { cloudinaryUploader } from "config/cloudiary.config";
import ResponseSender from "helper/response.helper";
import User from "../User/user.model";
import Story from "./story.model";
import fs from "fs";
import { activityType } from "utilities/activity";
import userServices from "../User/user.service";
import { socketServer } from "server";

const getMyStories = async (req, res, next) => {
  try {
    const { seed } = req.params;
    const myId = req.user._id;
    const me = await User.findById(myId).lean();
    let stories = await Story.find({ userId: me._id })
      .sort({ createdAt: -1 })
      .skip(Number(seed) * 5)
      .limit(Number(seed) + 5)
      .populate("owner")
      .lean();
    return ResponseSender.success(res, { stories });
  } catch (err) {
    next(err);
  }
};

const getStories = async (req, res, next) => {
  try {
    const { seed } = req.params;
    let myStories = await Story.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .populate("owner")
      .lean();
    let myFriendStories = await Story.find({
      userId: { $in: [...req.user.friendId] },
    })
      .sort({ createdAt: -1 })
      .populate("owner")
      .lean();
    let stories = new Set(
      [...myStories, ...myFriendStories]
        .filter((i) => i.imageUrl.length > 0 || i.includeImage === undefined)
        .splice(Number(seed) * 5, Number(seed) + 5)
    );
    return ResponseSender.success(res, { stories: Array.from(stories) });
  } catch (error) {
    next(error);
  }
};

const getStoriesByUserId = async (req, res, next) => {
  try {
    const { userId, seed } = req.params;
    let stories = await Story.find({ userId: userId })
      .sort({ createdAt: -1 })
      .populate("owner")
      .lean();
    if (
      stories.length > 0 &&
      !(req.user.friendId.filter((i) => i.toString() === userId).length > 0)
    ) {
      stories = stories.filter((i) => i.isPrivate === false);
      stories = stories.filter(
        (i) => i.includeImage === undefined || i.imageUrl.length > 0
      );
    }
    stories = stories.splice(Number(seed) * 5, Number(seed) + 5);
    return ResponseSender.success(res, { stories });
  } catch (err) {
    next(err);
  }
};

const deleteOne = async (req, res, next) => {
  try {
    const { storyId } = req.params;
    await Story.findOneAndRemove({ _id: storyId, userId: req.user._id });
    await userServices.setScore({
      userId: req.user._id,
      value: activityType.REMOVE_STORY,
    });
    socketServer.sockets.emit("story/delete", { storyId });
    return ResponseSender.success(res, { message: "success" });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const { content, isPrivate } = req.body;
    const newItem = await Story.create({
      userId: req.user._id,
      content: content,
      isPrivate,
    });
    req.files.length > 0 &&
      (await Story.findByIdAndUpdate(newItem._id, {
        includeImage: true,
      }));
    await req.files.map(async (file) => {
      let response = await cloudinaryUploader(file.path, "/picture_stories");
      fs.unlinkSync(file.path);
      let storyUpdated = await Story.findByIdAndUpdate(
        newItem._id,
        {
          $addToSet: { imageUrl: response.url },
        },
        { new: true }
      );
      console.log(storyUpdated);
      socketServer.sockets.emit("image/uploaded", { story: storyUpdated });
      console.log("image uploaded");
    });
    const story = await Story.findById(newItem._id).populate("owner").lean();
    await userServices.setScore({
      userId: req.user._id,
      value: activityType.ADD_NEW_STORY,
    });
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

const getById = async (req, res, next) => {
  try {
    const { storyId } = req.params;
    const story = await Story.findById(storyId).populate("owner").lean();
    return ResponseSender.success(res, { story });
  } catch (error) {
    next(error);
  }
};

const storyController = {
  getById,
  getMyStories,
  getStoriesByUserId,
  create,
  updateOne,
  deleteOne,
  getStories,
};

export default storyController;
