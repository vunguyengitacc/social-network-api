import { Joi, Segments } from "celebrate";
export const registerScheme = {
  body: Joi.object().keys({
    username: Joi.string().alphanum().min(6).max(30).required(),
    password: Joi.string().alphanum().min(6).max(30).required(),
    fullname: Joi.string().alphanum().min(6).max(30).required(),
  }),
};
