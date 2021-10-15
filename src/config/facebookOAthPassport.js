import Passport from "passport";
import { Strategy } from "passport-facebook";
require("dotenv").config();

export const facebookOAuthPassport = () => {
  return Passport.use(
    new Strategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL:
          process.env.NODE_ENV == "production"
            ? process.env.BASE_URL + "api/auth/facebook/callback"
            : "http://localhost:5000/api/auth/facebook/callback",
      },
      function (accessToken, refreshToken, profile, done) {
        done(null, profile);
      }
    )
  );
};
