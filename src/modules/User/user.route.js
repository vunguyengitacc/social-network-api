import express from "express";
import userController from "./user.controller";

const UserRouter = express.Router();

UserRouter.route("/:userId").get(userController.getUserById);
UserRouter.route("/search/:term").get(userController.searchUser);

export default UserRouter;
