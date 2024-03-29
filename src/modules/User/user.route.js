import express from "express";
import imageUploadMiddleware from "../../middleware/imageUpload.middleware";
import userController from "./user.controller";

const UserRouter = express.Router();

UserRouter.route("/avatar/me").put(
  imageUploadMiddleware,
  userController.updateAvatar
);
UserRouter.route("/background/me").put(
  imageUploadMiddleware,
  userController.updateBackground
);
UserRouter.route("/me").put(userController.updateMe);
UserRouter.route("/search").get(userController.searchUser);
UserRouter.route("/recommend").get(userController.getRecommend);
UserRouter.route("/:userId").get(userController.getUserById);
UserRouter.route("/me/friend").put(userController.addFriend);
UserRouter.route("/me/friend/:friendId").delete(userController.removeFriend);
UserRouter.route("/me/friend/:friendId/answer")
  .post(userController.acceptRequest)
  .delete(userController.denyRequest);

export default UserRouter;
