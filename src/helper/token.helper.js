import jwt from "jsonwebtoken";

/**
 * create an json web token
 * @param {any} user an object of user mongoose scheme
 * @returns {string} the access token
 */
export const createAccessToken = (user) => {
  const access_token = jwt.sign(
    { id: user._id, username: user.username },
    process.env.SECRET_KEY,
    {}
  );
  return access_token;
};
