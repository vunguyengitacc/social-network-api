import express from "express";
import imageUploadMiddleware from "../../middleware/imageUpload.middleware";
import storyController from "./story.controller";

const StoryRouter = express.Router();

StoryRouter.route("/:seed").get(storyController.getStories);
StoryRouter.route("/me/:seed").get(storyController.getMyStories);
StoryRouter.route("/me").post(imageUploadMiddleware, storyController.create);
StoryRouter.route("/me/:storyId")
  .put(storyController.updateOne)
  .delete(storyController.deleteOne);
StoryRouter.route("/:userId").get(storyController.getStoriesByUserId);
StoryRouter.route("/:storyId").put(storyController.reactToStory);

export default StoryRouter;
