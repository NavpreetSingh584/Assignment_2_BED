import Joi from "joi";

/** CREATE payload validation */
export const employeeCreateSchema = Joi.object({
  name: Joi.string().trim().min(2).max(80).required()
    .messages({ "string.empty": "name is required" }),
  position: Joi.string().trim().min(2).max(60).required(),
  department: Joi.string().trim().min(2).max(60).required(),
  email: Joi.string().trim().email().required(),
  phone: Joi.string().trim().pattern(/^[0-9+\-\s()]{7,20}$/).required()
    .messages({ "string.pattern.base": "phone must be a valid phone number" }),
  branchId: Joi.alternatives(
    Joi.number().integer().min(1),
    Joi.string().trim().min(1)
  ).required()
}).required();

/** UPDATE payload validation (partial allowed) */
export const employeeUpdateSchema = employeeCreateSchema.fork(
  ["name", "position", "department", "email", "phone", "branchId"],
  (s) => s.optional()
);
