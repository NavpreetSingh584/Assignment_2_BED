//  src/api/v1/validation/branch.schema.ts
import Joi from "joi";

export const branchCreateSchema = Joi.object({
  name: Joi.string().trim().required(),
  address: Joi.string().trim().required(),
  phone: Joi.string().trim().required(),
});

export const branchUpdateSchema = branchCreateSchema.fork(
  ["name", "address", "phone"],
  (schema) => schema.optional()
);
