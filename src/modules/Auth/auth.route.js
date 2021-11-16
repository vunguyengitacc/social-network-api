import express from "express";
import passport from "passport";
import checkToken from "middleware/checkToken.middleware";
import authController from "./auth.controller";
import { celebrate } from "celebrate";
import authValidate from "./auth.validate";

const AuthRouter = express.Router();
AuthRouter.route("/me").get(checkToken, authController.getMe);
AuthRouter.route("/login").post(
  celebrate(authValidate.loginSchema),
  authController.login
);
AuthRouter.route("/register").post(
  celebrate(authValidate.registerSchema),
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
