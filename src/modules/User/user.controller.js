import mongosse from "mongoose";
import { cloudinaryUploader } from "../../config/cloudiary.config";
import ResponseSender from "../../helper/response.helper";
import User from "./user.model";
import fs from "fs";
import notificationService from "../Notification/notification.service";
import { socketServer } from "../../server";

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
    const data = { ...req.body };
    const user = await User.findByIdAndUpdate(req.user._id, data, {
      new: true,
    });
    await User.populate(user, "friends");
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
    await User.populate(user, "friends");
    await User.populate(to, "friends");
    socketServer.sockets.emit("friend/request/add", { user, to });
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
    await notificationService.removeByInfor({
      toId: friendId,
      fromId: userId,
      type: 1,
    });
    await User.populate(user, "friends");
    await User.populate(to, "friends");
    socketServer.sockets.emit("friend/delete", { user, to });
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
    await notificationService.removeByInfor({
      toId: myId,
      fromId: friendId,
      type: 1,
    });
    await User.populate(from, "friends");
    await User.populate(to, "friends");
    socketServer.sockets.emit("friend/request/deny", { user: from, to });
    return ResponseSender.success(res, { message: "Success" });
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
    await notificationService.removeByInfor({
      toId: myId,
      fromId: friendId,
      type: 1,
    });

    await User.populate(from, "friends");
    await User.populate(to, "friends");
    socketServer.sockets.emit("friend/request/accept", { user: from, to });
    return ResponseSender.success(res, { message: "Success" });
  } catch (error) {
    next(error);
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    const data = await cloudinaryUploader(req.files[0].path, "/picture_avatar");
    fs.unlinkSync(req.files[0].path);
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
    const data = await cloudinaryUploader(
      req.files[0].path,
      "/picture_background"
    );
    fs.unlinkSync(req.files[0].path);
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

const getRecommend = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } })
      .sort({ hotScore: "desc" })
      .skip(0)
      .limit(20)
      .lean();
    return ResponseSender.success(res, { users });
  } catch (error) {
    next(error);
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
  getRecommend,
};

export default userController;
