import express from "express";
import storyController from "./story.controller";

const StoryRouter = express.Router();

StoryRouter.route("/me")
  .get(storyController.getMyStories)
  .post(storyController.create)
  .delete(storyController.deleteOne);
StoryRouter.route("/:userId").get(storyController.getStoriesByUserId);

export default StoryRouter;
