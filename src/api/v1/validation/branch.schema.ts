import Joi from "joi";

const phone = Joi.string()
  .pattern(/^\+?[0-9\-\s]{7,20}$/)
  .messages({ "string.pattern.base": "phone must be digits/spaces/dashes and 7–20 chars" });

export const createBranchSchema = Joi.object({
  name: Joi.string().min(2).max(80).required().messages({
    "string.min": "name must be at least 2 characters",
    "any.required": "name is required",
  }),
  address: Joi.string().min(5).max(200).required().messages({
    "string.min": "address must be at least 5 characters",
    "any.required": "address is required",
  }),
  phone: phone.optional(),
});

export const updateBranchSchema = createBranchSchema.fork(
  ["name", "address"],
  (s) => s.optional()
);
