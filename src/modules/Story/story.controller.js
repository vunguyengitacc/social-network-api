import ResponseSender from "../../helper/response.helper";
import User from "../User/user.model";
import Story from "./story.model";

const getMyStories = async (req, res, next) => {
  try {
    const myId = req.user._id;
    const me = await User.findById(myId).lean();
    const stories = await Story.find({ userId: me._id }).lean();
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

const create = async (req, res, next) => {
  try {
    const data = { ...req.body };
  } catch (err) {
    next(err);
  }
};

const deleteOne = async (req, res, next) => {
  try {
    const data = { ...req.body };
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
