import mongosse from "mongoose";
import { cloudinaryUploader } from "../../config/cloudiary.config";
import ResponseSender from "../../helper/response.helper";
import User from "./user.model";
import fs from "fs";

const getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate("friends").lean();
    if (!user) return ResponseSender.error(res, { message: "user id invalid" });
    return ResponseSender.success(res, { user });
  } catch (err) {
    next(err);
  }
};

const searchUser = async (req, res, next) => {
  try {
    const { term } = req.query;
    let users;
    if (mongosse.isValidObjectId(term)) {
      users = await User.findById(term).lean();
      if (users != null) return ResponseSender.success(res, { users: [users] });
    }
    users = await User.aggregate([{ $match: { $text: { $search: term } } }]);
    return ResponseSender.success(res, { users });
  } catch (err) {
    next(err);
  }
};

const updateMe = async (req, res, next) => {
  try {
    const { address, job, education, fullname } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { address, job, education, fullname },
      { new: true }
    );
    return ResponseSender.success(res, { user });
  } catch (error) {
    next(error);
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    const data = await cloudinaryUploader(req.file.path, "/picture_avatar");
    fs.unlinkSync(req.file.path);
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatarUri: data.url },
      { new: true }
    );
    return ResponseSender.success(res, { user });
  } catch (err) {
    next(err);
  }
};

const updateBackground = async (req, res, next) => {
  try {
    const data = await cloudinaryUploader(req.file.path, "/picture_background");
    fs.unlinkSync(req.file.path);
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { backgroundUrl: data.url },
      { new: true }
    );
    return ResponseSender.success(res, { user });
  } catch (err) {
    next(err);
  }
};

const userController = {
  getUserById,
  searchUser,
  updateMe,
  updateAvatar,
  updateBackground,
};

export default userController;
