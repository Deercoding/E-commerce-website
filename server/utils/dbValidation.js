import Joi from "joi";

//register validation
export function productUpdateValidation(data) {
  const schema = Joi.object({
    texture: Joi.string().required(),
    title: Joi.string().required(),
    category: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    texture: Joi.string().required(),
    wash: Joi.string().required(),
    place: Joi.string().required(),
    note: Joi.string().required(),
    story: Joi.string().required(),
    color_code: Joi.string(),
    color_name: Joi.string(),
    size: Joi.string(),
    stock: Joi.string(),
    color_code2: Joi.string().allow(null, ""),
    color_name2: Joi.string().allow(null, ""),
    size2: Joi.string().allow(null, ""),
    stock2: Joi.string().allow(null, ""),
    color_code3: Joi.string().allow(null, ""),
    color_name3: Joi.string().allow(null, ""),
    size3: Joi.string().allow(null, ""),
    stock3: Joi.string().allow(null, ""),
  });
  return schema.validate(data);
}

export function signupValidation(data) {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  });
  return schema.validate(data);
}

export function signinNativeValidation(data) {
  const schema = Joi.object({
    provider: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
  });
  return schema.validate(data);
}

export function campaignValidation(data) {
  const schema = Joi.object({
    product_id: Joi.number().required(),
    story: Joi.string().required(),
  });
  return schema.validate(data);
}
