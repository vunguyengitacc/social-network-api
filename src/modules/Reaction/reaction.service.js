import { Types } from "mongoose";
import Reaction from "./reaction.model";

/**
 * reaction an story
 * @param {object} data an object contains 3 value: storyId, userId, type
 * @param {number} data.type the type of react: 1-like, 2-dislike, 3-love
 * @param {string} data.userId the id of user who do reaction
 * @param {string} data.storyId the id of the story which will get react
 * @returns story after do react, null if not exist
 */
const reactStory = async (data) => {
  try {
    const { storyId, reactType, userId } = data;
    const doc = await Reaction.findOne({ storyId, userId }).lean();
    if (doc === null) return await Reaction.create(data);
    else
      return await Reaction.findOneAndUpdate(
        { storyId, userId },
        { reactType },
        { new: true }
      );
  } catch (error) {
    return null;
  }
};

/**
 * get all reaction about a story
 * @param {string} storyId the id of story want to get reactions
 * @returns {Promise<any>} the list of reaction group by their type, null if not an error is catched
 */
const getByStoryId = async (storyId) => {
  try {
    const doc = await Reaction.find({ storyId }).lean();
    return doc;
  } catch (error) {
    return null;
  }
};

/**
 * delete an reaction document of user to story
 * @param {object} data an objects that contains 2 value: userId and storyId
 * @param {string} data.userId the id of user who is the owner of reaction
 * @param {string} data.storyId the id of story which is the target of reaction
 * @returns {Promise<any>} the reaction was deleted
 */
const deleteOne = async (data) => {
  try {
    const { userId, storyId } = data;
    const doc = await Reaction.findOneAndRemove(
      { userId, storyId },
      { returnDocument: true }
    );
    return doc;
  } catch (error) {
    return null;
  }
};

const getOverall = async (storyId) => {
  try {
    const doc = await Reaction.aggregate([
      {
        $match: { storyId: Types.ObjectId(storyId) },
      },
      {
        $group: {
          _id: "$reactType",
          count: { $sum: 1 },
        },
      },
    ]);
    return doc;
  } catch (error) {
    return [];
  }
};

const reactionService = { reactStory, getByStoryId, deleteOne, getOverall };

export default reactionService;
