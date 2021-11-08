import User from "./user.model";

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
