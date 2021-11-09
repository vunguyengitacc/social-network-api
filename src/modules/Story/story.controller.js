import { cloudinaryUploader } from "../../config/cloudiary.config";
import ResponseSender from "../../helper/response.helper";
import User from "../User/user.model";
import Story from "./story.model";
import fs from "fs";
import { activityType } from "../../utilities/activity";
import userServices from "../User/user.service";
import storyService from "./story.service";

const getMyStories = async (req, res, next) => {
  try {
    const { seed } = req.params;
    const myId = req.user._id;
    const me = await User.findById(myId).lean();
    const stories = await Story.find({ userId: me._id })
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
      .populate("owner")
      .lean();
    let myFriendStories = await Story.find({
      userId: { $in: [...req.user.friendId] },
    })
      .populate("owner")
      .lean();
    let stories = new Set(
      [...myStories, ...myFriendStories].splice(
        Number(seed) * 5,
        Number(seed) + 5
      )
    );
    return ResponseSender.success(res, { stories: Array.from(stories) });
  } catch (error) {
    next(error);
  }
};

const getStoriesByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;
    let stories = await Story.find({ userId: userId }).populate("owner").lean();
    if (
      stories.length > 0 &&
      !(req.user.friendId.filter((i) => i.toString() === userId).length > 0)
    )
      stories = stories.filter((i) => i.isPrivate === false);
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
      likeById: [],
      dislikeById: [],
    });
    await req.files.map(async (file) => {
      let response = await cloudinaryUploader(file.path, "/picture_stories");
      fs.unlinkSync(file.path);
      await Story.findByIdAndUpdate(newItem._id, {
        $addToSet: { imageUrl: response.url },
      });
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

const reactToStory = async (req, res, next) => {
  try {
    const { storyId } = req.params;
    const { like, dislike } = req.body;
    const userId = req.user._id;
    const story = await storyService.reactStory({
      storyId,
      like,
      dislike,
      userId,
    });
    if (story !== null) return ResponseSender.success(res, { story });
    else return ResponseSender.error(res, { message: "Invalid story" });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const { storyId } = req.params;
    const story = await Story.findById(storyId).populate("owner").lean();
    console.log(story);
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
  reactToStory,
  getStories,
};

export default storyController;
