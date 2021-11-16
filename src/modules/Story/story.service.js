import { activityType } from "../../utilities/activity";
import userServices from "../User/user.service";
import Story from "./story.model";

/**
 * do reaction to story by user
 * @param data an object cotains 4 value: like, dislike, userId, storyId
 * @returns story after do react(null if catch error)
 */
const reactStory = async (data) => {
  try {
    const { like, dislike, storyId, userId } = data;
    let story;
    let check = await Story.findById(storyId).lean();
    let value = 0;
    switch (true) {
      /**
       * user press button like
       * input: like == true
       */
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
      /**
       * user press button like whhen already like
       * input: like == false
       */
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
      /**
       * user press button dislike
       * inpit: dislike == true
       */
      case like === undefined && dislike:
        if (
          check.likeById.filter((i) => userId.toString() === i.toString())
            .length > 0
        ) {
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
      /**
       * user press button dislike when already dislike
       * input: dislike == false
       */
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
