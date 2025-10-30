import Joi from 'joi';

/**
 * Use meta + description to improve joi-to-swagger output.
 */
export const itemCreateSchema = Joi.object({
  title: Joi.string().min(3).max(100).required().description('Item title'),
  description: Joi.string().max(500).required().description('Item description'),
  price: Joi.number().min(0).precision(2).required().description('Price in dollars'),
}).meta({ className: 'ItemCreate' });

export const itemResponseSchema = Joi.object({
  id: Joi.string().required().description('Item ID'),
  title: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
  createdAt: Joi.string().isoDate().required(),
}).meta({ className: 'Item' });
