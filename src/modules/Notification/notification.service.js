import { socketServer } from "../../server";
import Notification from "./notification.model";

/**
 * create a document of notification scheme
 * @param {object} data all data of notification
 * @returns {object} notification after created
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

/**
 * remove a document of notification by its id
 * @param {string} data._id the id of notification
 * @returns {object} the notification which is deleted
 */
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

/**
 * remove a document of notification by its information
 * @param {string} data.toId the id of user who will get the notification
 * @param {string} data.fromId the id of user who send the notification
 * @param {number} data.type the type of the notification
 * @returns {object} the notification which is deleted
 */
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
