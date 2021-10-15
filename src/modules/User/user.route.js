import express from "express";
import userController from "./user.controller";

const UserRouter = express.Router();

UserRouter.route("/search").get(userController.searchUser);
UserRouter.route("/:userId").get(userController.getUserById);

export default UserRouter;
