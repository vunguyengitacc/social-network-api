import ResponseSender from "../../helper/response.helper";
import { createAccessToken } from "../../helper/token.helper";
import { activityType } from "../../utilities/activity";
import User from "../User/user.model";
import userServices from "../User/user.service";

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password }).lean();
    if (!user) return ResponseSender.error(res, { message: "failed" });
    const access_token = createAccessToken(user);
    ResponseSender.success(res, { access_token });
    await userServices.setScore({
      userId: newUser._id,
      value: activityType.LOGIN,
    });
  } catch (err) {
    next(err);
  }
};

const register = async (req, res, next) => {
  try {
    const { username, password, fullname } = req.body;
    const user = await User.findOne({ username }).lean();
    if (user) return ResponseSender.error(res, { message: "failed" });
    const newUser = await User.create({
      username: username,
      fullname: fullname,
      password: password,
      avatarUri: `https://avatars.dicebear.com/api/initials/${fullname}.svg`,
      job: [],
      education: [],
      hotScore: 10,
    });
    const access_token = createAccessToken(newUser);
    ResponseSender.success(res, { access_token });
  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate("friends").lean();
    ResponseSender.success(res, { user });
  } catch (err) {
    next(err);
  }
};

const loginWithFacebook = async (req, res, next) => {
  try {
    const { name, id } = req.federatedUser._json;
    const checkUser = await User.findOne({ username: `facebookId-${id}` });
    if (checkUser != null) {
      const access_token = createAccessToken(checkUser);
      res.redirect(`${process.env.CLIENT_URL}/auth/oauth/${access_token}`);
      return;
    }
    const newUser = await User.create({
      username: `facebookId-${id}`,
      fullname: name,
      avatarUri: `https://graph.facebook.com/${id}/picture?type=large&width=720&height=720`,
      job: [],
      education: [],
      hotScore: 5,
    });
    const access_token = createAccessToken(newUser);
    res.redirect(`${process.env.CLIENT_URL}/auth/oauth/${access_token}`);
  } catch (err) {
    next(err);
  }
};

const authController = {
  loginWithFacebook,
  login,
  register,
  getMe,
};

export default authController;
