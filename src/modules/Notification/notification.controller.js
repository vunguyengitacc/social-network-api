import ResponseSender from "../../helper/response.helper";
import Notification from "./notification.model";

const getAllToMe = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ toId: req.user._id })
      .populate("to")
      .populate("from")
      .lean();
    return ResponseSender.success(res, { notifications });
  } catch (error) {
    next(error);
  }
};

const notificationController = {
  getAllToMe,
};

export default notificationController;
