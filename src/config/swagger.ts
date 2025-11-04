import { Application, Router } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc, { SwaggerDefinition } from "swagger-jsdoc";
import convert from "joi-to-swagger";
import { itemCreateSchema, itemResponseSchema } from "../api/v1/validation/item.schema";

/**
 * Recursively remove properties that cause circular references ($ref, components)
 */
const sanitize = (obj: any): any => {
  if (obj === null || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(sanitize);

  const clean: any = {};
  for (const [key, value] of Object.entries(obj)) {
    if (key === "$ref" || key === "components") continue;
    clean[key] = sanitize(value);
  }
  return clean;
};

// --- Convert Joi schemas to OpenAPI and sanitize them ---
const { swagger: rawCreate } = convert(itemCreateSchema);
const { swagger: rawItem } = convert(itemResponseSchema);

const itemCreateDef = sanitize(rawCreate);
const itemDef = sanitize(rawItem);

// --- Base OpenAPI definition ---
const baseDefinition: SwaggerDefinition = {
  openapi: "3.0.3",
  info: {
    title: "Assignment 2 API Documentation",
    version: "1.0.0",
    description: "Auto-generated OpenAPI documentation for Assignment 2 (Firestore + Joi Validation)",
    license: {
      name: "MIT",
      url: "https://opensource.org/licenses/MIT",
    },
  },
  servers: [
    {
      url: "http://localhost:3000/api/v1",
      description: "Local Development Server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      // --- Item Schemas ---
      ItemCreate: itemCreateDef,
      Item: itemDef,

      // --- Branch Schemas ---
      BranchCreate: {
        type: "object",
        properties: {
          name: { type: "string", example: "Main Branch" },
          location: { type: "string", example: "Winnipeg" },
        },
        required: ["name", "location"],
      },
      BranchUpdate: {
        type: "object",
        properties: {
          name: { type: "string" },
          location: { type: "string" },
        },
      },

      // --- Employee Schemas ---
      EmployeeCreate: {
        type: "object",
        properties: {
          name: { type: "string", example: "Harman Maan" },
          department: { type: "string", example: "IT" },
          email: { type: "string", example: "harman@example.com" },
          phone: { type: "string", example: "204-555-1234" },
        },
        required: ["name", "department", "email", "phone"],
      },
      EmployeeUpdate: {
        type: "object",
        properties: {
          name: { type: "string" },
          department: { type: "string" },
          email: { type: "string" },
          phone: { type: "string" },
        },
      },
    },
  },
};

// --- Collect all route-level JSDoc paths ---
const jsdocSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Assignment 2 Temp Spec",
      version: "1.0.0",
    },
  },
  apis: ["src/api/v1/routes/**/*.ts"], // Adjust path if needed
}) as { paths?: Record<string, any> };

// --- Merge route docs into base definition ---
const spec = {
  ...baseDefinition,
  paths: jsdocSpec.paths || {},
};

// --- Mount Swagger UI ---
export const setupSwagger = (app: Application) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(spec));

  // Also expose raw OpenAPI spec (JSON)
  app.get("/api-docs/openapi.json", (_req, res) => res.json(spec));
};

export const getSpec = () => spec;
