import { Application, Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import  convert from 'joi-to-swagger';
import { itemCreateSchema, itemResponseSchema } from '../api/v1/validation/item.schema';

const { swagger: itemCreate } = convert(itemCreateSchema);
const { swagger: item }       = convert(itemResponseSchema);

const spec = swaggerJSDoc({
  definition: {
    openapi: '3.0.3',
    info: { title: 'Your API', version: '1.0.0', description: 'Inline-documented API with Joi components' },
    servers: [{ url: 'http://localhost:3000' }],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
      schemas: {
        ItemCreate: itemCreate,
        Item: item,
      },
    },
  },
  apis: ['src/routes/**/*.ts'], 
});

export const serveDocs = (app: Application) => {
  app.use('/api/docs', swaggerUi.serve);
};

export const docsRouter = Router()
  .get('/', swaggerUi.setup(spec))
  .get('/openapi.json', (_req, res) => res.json(spec));

// Node script helper for CI export
export const getSpec = () => spec;
