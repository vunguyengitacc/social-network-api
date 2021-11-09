import express from "express";
import commentController from "./comment.controller";
const CommentRouter = express.Router();

CommentRouter.route("/").post(commentController.create);
CommentRouter.route("/:commentId").delete(commentController.deleteById);
CommentRouter.route("/story/:storyId").get(commentController.getByStoryId);

export default CommentRouter;
