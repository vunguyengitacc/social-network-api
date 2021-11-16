import User from "./user.model";

/**
 * add score to user's score pool
 * @param {any} data an object that contains data: userId and value
 * @param {string} data.userId the id of user that will be set score
 * @param {number} data.value the score that will be add to user's score pool
 * @returns {boolean} true if succuss, false if failed/error catched
 */
const setScore = async (data) => {
  try {
    const { userId, value } = data;
    await User.findByIdAndUpdate(userId, { $inc: { hotScore: value } });
    return true;
  } catch (error) {
    return false;
  }
};

const userServices = {
  setScore,
};

export default userServices;
