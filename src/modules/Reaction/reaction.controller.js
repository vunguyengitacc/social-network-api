import ResponseSender from "helper/response.helper";
import { socketServer } from "../../server";

import Reaction from "./reaction.model";
import reactionService from "./reaction.service";

const react = async (req, res, next) => {
  try {
    const { storyId } = req.params;
    const { type } = req.body;
    let userId = req.user._id;
    const reaction = await reactionService.reactStory({
      storyId,
      reactType: type,
      userId,
    });
    socketServer.sockets.emit("reaction/touch", { reaction });
    return ResponseSender.success(res, { reaction });
  } catch (error) {
    next(error);
  }
};

const getByStory = async (req, res, next) => {
  try {
    const { storyId } = req.params;
    const reactions = await reactionService.getByStoryId(storyId);
    return ResponseSender.success(res, { reactions });
  } catch (error) {
    next(error);
  }
};

const getMyReactionToStory = async (req, res, next) => {
  try {
    const { storyId } = req.params;
    const userId = req.user._id;
    const reaction = await Reaction.findOne({ storyId, userId }).lean();
    return ResponseSender.success(res, { reaction });
  } catch (error) {
    next(error);
  }
};

const deleteOne = async (req, res, next) => {
  try {
    const { storyId } = req.params;
    let userId = req.user._id;
    const reaction = await reactionService.deleteOne({ userId, storyId });
    return ResponseSender.success(res, { reaction });
  } catch (error) {
    next(error);
  }
};

const getOverall = async (req, res, next) => {
  try {
    const { storyId } = req.params;
    const reactions = await reactionService.getOverall(storyId);
    return ResponseSender.success(res, { reactions });
  } catch (error) {
    next(error);
  }
};

const reactionController = {
  react,
  getMyReactionToStory,
  getByStory,
  deleteOne,
  getOverall,
};

export default reactionController;
