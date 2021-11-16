import express from "express";
import passport from "passport";
import checkToken from "middleware/checkToken.middleware";
import authController from "./auth.controller";
import { registerScheme } from "./auth.validate";
import { celebrate } from "celebrate";

const AuthRouter = express.Router();
AuthRouter.route("/me").get(checkToken, authController.getMe);
AuthRouter.route("/login").post(authController.login);
AuthRouter.route("/register").post(
  celebrate(registerScheme),
  authController.register
);
AuthRouter.route("/facebook").get(passport.authenticate("facebook"));
AuthRouter.route("/facebook/callback").get(
  passport.authenticate("facebook", {
    assignProperty: "federatedUser",
    failureRedirect: "/login",
  }),
  authController.loginWithFacebook
);

export default AuthRouter;
