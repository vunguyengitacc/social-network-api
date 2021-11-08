import { activityType } from "../../utilities/activity";
import userServices from "../User/user.service";
import Story from "./story.model";

const reactStory = async (data) => {
  try {
    const { like, dislike, storyId, userId } = data;
    let story;
    let check = await Story.findById(storyId).lean();
    let value = 0;
    switch (true) {
      case dislike === undefined && like:
        if (
          check.dislikeById.filter((i) => userId.toString() === i.toString())
            .length > 0
        ) {
          value = activityType.LIKE;
        }
        story = await Story.findByIdAndUpdate(
          storyId,
          {
            $pull: { dislikeById: userId },
            $addToSet: { likeById: userId },
          },
          { new: true }
        );
        await userServices.setScore({
          userId: story.userId,
          value: value + activityType.LIKE,
        });
        break;
      case dislike === undefined && !like:
        story = await Story.findByIdAndUpdate(
          storyId,
          {
            $pull: { likeById: userId },
          },
          { new: true }
        );
        await userServices.setScore({
          userId: story.userId,
          value: activityType.DISLIKE,
        });
        break;
      case like === undefined && dislike:
        if (
          check.likeById.filter((i) => userId.toString() === i.toString())
            .length > 0
        ) {
          console.log("here");
          value = activityType.DISLIKE;
        }
        story = await Story.findByIdAndUpdate(
          storyId,
          {
            $pull: { likeById: userId },
            $addToSet: { dislikeById: userId },
          },
          { new: true }
        );
        await userServices.setScore({
          userId: story.userId,
          value: value + activityType.DISLIKE,
        });
        break;
      case like === undefined && !dislike:
        story = await Story.findByIdAndUpdate(
          storyId,
          {
            $pull: { dislikeById: userId },
          },
          { new: true }
        );

        await userServices.setScore({
          userId: story.userId,
          value: activityType.LIKE,
        });
        break;
      default:
        break;
    }
    return story;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const storyService = { reactStory };

export default storyService;
