import ResponseSender from "../../helper/response.helper";
import Comment from "./comment.model";

const getByStoryId = async (req, res, next) => {
  try {
    const { storyId } = req.params;
    const comments = await Comment.find({ storyId })
      .populate("story")
      .populate("owner")
      .sort({ createdAt: 1 })
      .lean();
    return ResponseSender.success(res, { comments });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const { storyId, content } = req.body;
    const comment = await Comment.create({
      storyId,
      userId: req.user._id,
      content,
    });
    await Comment.populate(comment, { path: "owner" });
    await Comment.populate(comment, { path: "story" });
    return ResponseSender.success(res, { comment });
  } catch (error) {
    next(error);
  }
};

const deleteById = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const comment = await Comment.findOneAndRemove(
      {
        _id: commentId,
        userId: req.user._id,
      },
      { rawResult: true }
    );
    if (comment === null)
      return ResponseSender.error(res, { message: "Unauthorized" });
    else return ResponseSender.success(res, { message: "Complete" });
  } catch (error) {
    next(error);
  }
};

const commentController = {
  getByStoryId,
  create,
  deleteById,
};

export default commentController;
