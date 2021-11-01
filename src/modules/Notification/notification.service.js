import Notification from "./notification.model";

const createOne = async (data) => {
  try {
    const notification = await Notification.create({ ...data, active: true });
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
