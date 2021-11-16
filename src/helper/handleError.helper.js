import { isCelebrateError } from "celebrate";
import ResponseSender from "./response.helper";

const handleError = (err, req, res, next) => {
  if (isCelebrateError(err)) {
    const joi = err.details.get("body");
    const errors = joi.details.map(({ message, context }) => {
      const { key } = context;
      return { message: message.replace(/[""]/g, ""), key };
    });
    return ResponseSender.error(res, {
      type: "Validate error",
      message: errors[0].message,
      key: errors[0].key,
    });
  }
  return ResponseSender.error(res, { message: err.message }, 500);
};

export default handleError;
