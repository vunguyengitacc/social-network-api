import Notification from "./notification.model";

const createOne = async (data) => {
  try {
    const data = await Notification.create(data);
    return data;
  } catch (error) {
    return null;
  }
};

const removeOne = async (data) => {
  try {
    await Notification.findByIdAndRemove(data._id, { returnDocument: true });
    return notification;
  } catch (error) {
    return null;
  }
};

const notificationService = {
  createOne,
  removeOne,
};

export default notificationService;
