import Joi from "joi";

const phone = Joi.string()
  .pattern(/^\+?[0-9\-\s]{7,20}$/)
  .messages({ "string.pattern.base": "phone must be digits/spaces/dashes and 7–20 chars" });

export const createEmployeeSchema = Joi.object({
  name: Joi.string().min(2).max(80).required().messages({
    "string.min": "name must be at least 2 characters",
    "any.required": "name is required",
  }),
  position: Joi.string().min(2).max(80).required().messages({
    "string.min": "position must be at least 2 characters",
    "any.required": "position is required",
  }),
  department: Joi.string().min(2).max(80).required().messages({
    "any.required": "department is required",
  }),
  email: Joi.string().email({ tlds: { allow: false } }).required().messages({
    "string.email": "email must be valid",
    "any.required": "email is required",
  }),
  phone: phone.optional(),
  branchId: Joi.string().min(1).required().messages({
    "any.required": "branchId is required",
  }),
});

export const updateEmployeeSchema = createEmployeeSchema.fork(
  ["name", "position", "department", "email", "branchId"],
  (s) => s.optional()
);
