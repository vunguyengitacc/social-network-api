import express from "express";
import notificationController from "./notification.controller";
const NotificationRouter = express.Router();

NotificationRouter.route("/").get(notificationController.getAllToMe);

export default NotificationRouter;
