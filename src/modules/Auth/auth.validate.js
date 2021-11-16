import { Joi, Segments } from "celebrate";
const registerSchema = {
  body: Joi.object().keys({
    username: Joi.string().alphanum().min(6).max(30).required(),
    password: Joi.string().alphanum().min(6).max(30).required(),
    fullname: Joi.string().alphanum().min(6).max(30).required(),
  }),
};

const loginSchema = {
  body: Joi.object().keys({
    username: Joi.string().alphanum().min(6).max(30).required(),
    password: Joi.string().alphanum().min(6).max(30).required(),
  }),
};

const authValidate = {
  registerSchema,
  loginSchema,
};

export default authValidate;
