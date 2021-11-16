import { socketServer } from "../../server";
import Notification from "./notification.model";

/**
 * create a document of notification scheme
 * @param {any} data data of notification
 * @returns notification after created
 */
const createOne = async (data) => {
  try {
    const notification = await Notification.create({ ...data, active: true });
    await Notification.populate(notification, "to");
    await Notification.populate(notification, "from");
    socketServer.emit("notification/add", { notification });
    return notification;
  } catch (error) {
    return null;
  }
};

const removeOne = async (data) => {
  try {
    const notification = await Notification.findByIdAndRemove(data._id, {
      returnDocument: true,
    });
    return notification;
  } catch (error) {
    return null;
  }
};

const removeByInfor = async (data) => {
  try {
    const notification = await Notification.findOneAndRemove(
      {
        toId: data.toId,
        fromId: data.fromId,
        type: data.type,
      },
      {
        returnDocument: true,
      }
    );
    console.log(notification);
    socketServer.emit("notification/delete", { id: notification._id });
    return notification;
  } catch (error) {
    return null;
  }
};

const notificationService = {
  createOne,
  removeOne,
  removeByInfor,
};

export default notificationService;
