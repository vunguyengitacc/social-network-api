import ResponseSender from "../helper/response.helper";
import jwt from "jsonwebtoken";
import User from "../modules/User/user.model";

const checkToken = async (req, res, next) => {
  try {
    let token = req.headers.authentication;
    if (!token)
      return ResponseSender.error(res, { message: "no token provided" });
    token = token.split(" ")[1];
    const decode = await jwt.decode(token, process.env.SECRET_KEY);
    const user = await User.findById(decode.id).lean();
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

export default checkToken;
