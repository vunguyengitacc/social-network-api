import mongosse from "mongoose";
import { cloudinaryUploader } from "../../config/cloudiary.config";
import ResponseSender from "../../helper/response.helper";
import User from "./user.model";
import fs from "fs";
import notificationService from "../Notification/notification.service";

const getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate("friends").lean();
    if (!user) return ResponseSender.error(res, { message: "user id invalid" });
    console.log(user.friendId);
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
    const data = { ...req.body };
    const user = await User.findByIdAndUpdate(req.user._id, data, {
      new: true,
    });
    return ResponseSender.success(res, { user });
  } catch (error) {
    next(error);
  }
};

const addFriend = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const requestId = req.user._id;
    const to = await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: { friendRequestId: requestId },
      },
      { new: true }
    );
    const user = await User.findByIdAndUpdate(
      requestId,
      {
        $addToSet: { friendWaitingId: to._id },
      },
      { new: true }
    );
    await notificationService.createOne({
      toId: userId,
      fromId: requestId,
      message: "send friend request",
      type: 1,
    });
    return ResponseSender.success(res, { user });
  } catch (error) {
    next(error);
  }
};

const removeFriend = async (req, res, next) => {
  try {
    const { friendId } = req.params;
    const userId = req.user._id;
    const to = await User.findByIdAndUpdate(
      friendId,
      {
        $pull: { friendId: userId, friendRequestId: userId },
      },
      { new: true }
    );
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $pull: { friendWaitingId: to._id, friendId: to._id },
      },
      { new: true }
    );
    return ResponseSender.success(res, { user });
  } catch (error) {
    next(error);
  }
};

const denyRequest = async (req, res, next) => {
  try {
    const { friendId } = req.params;
    const myId = req.user._id;
    const from = await User.findByIdAndUpdate(
      friendId,
      {
        $pull: { friendWaitingId: myId },
      },
      { new: true }
    );
    const to = await User.findByIdAndUpdate(
      myId,
      {
        $pull: { friendRequestId: friendId },
      },
      { new: true }
    );
    const notification = await notificationService.removeByInfor({
      toId: myId,
      fromId: friendId,
      type: 1,
    });
    return ResponseSender.success(res, { notification });
  } catch (error) {
    next(error);
  }
};

const acceptRequest = async (req, res, next) => {
  try {
    const { friendId } = req.params;
    const myId = req.user._id;
    const from = await User.findByIdAndUpdate(
      friendId,
      {
        $pull: { friendWaitingId: myId },
        $addToSet: { friendId: myId },
      },
      { new: true }
    );
    const to = await User.findByIdAndUpdate(
      myId,
      {
        $pull: { friendRequestId: friendId },
        $addToSet: { friendId: friendId },
      },
      { new: true }
    );
    const notification = await notificationService.removeByInfor({
      toId: myId,
      fromId: friendId,
      type: 1,
    });
    return ResponseSender.success(res, { notification });
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
  addFriend,
  removeFriend,
  denyRequest,
  acceptRequest,
};

export default userController;
