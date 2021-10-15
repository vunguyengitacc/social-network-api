import ResponseSender from "../../helper/response.helper";
import User from "./user.model";

const getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).lean();
    if (!user) return ResponseSender.error(res, { message: "user id invalid" });
    return ResponseSender.success(res, { user });
  } catch (err) {
    next(err);
  }
};

const searchUser = async (req, res, next) => {
  try {
    const { term } = req.params;
    const users = await User.find().lean();
    return ResponseSender.success(res, { users });
  } catch (err) {
    next(err);
  }
};

const userController = {
  getUserById,
  searchUser,
};

export default userController;
