import Joi from "joi";

export const  userFormSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email({ tlds: { allow: false }}).required(),
  password: Joi.string().min(6).required(),
});
