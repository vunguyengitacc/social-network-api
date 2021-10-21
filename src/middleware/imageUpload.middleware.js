import ResponseSender from "../helper/response.helper";

const imageUploadMiddleware = (req, res, next) => {
  try {
    if (!req.file && !req.files)
      return ResponseSender.error(
        res,
        { message: "empty data is not accepted" },
        401
      );
    next();
  } catch (err) {
    next(err);
  }
};

export default imageUploadMiddleware;
