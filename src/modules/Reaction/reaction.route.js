import express, { Router } from "express";
import reactionController from "./reaction.controller";

const ReactionRouter = express.Router();

ReactionRouter.route("/:storyId")
  .get(reactionController.getByStory)
  .post(reactionController.react)
  .delete(reactionController.deleteOne);
ReactionRouter.route("/:storyId/overall").get(reactionController.getOverall);
ReactionRouter.route("/:storyId/me").get(
  reactionController.getMyReactionToStory
);

export default ReactionRouter;
