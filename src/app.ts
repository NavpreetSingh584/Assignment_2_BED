import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import { employeeRouter, branchRouter } from "./api/v1/routes";

// Load environment variables from .env file
dotenv.config();

export const API_PREFIX = "/api/v1";
export const API_VERSION = "1.0.0";

const app = express();
app.use(express.json());
app.use(morgan("combined"));

// Security: Helmet configuration (API-safe defaults)
app.use(
  helmet({
    contentSecurityPolicy: false, // disable if using Swagger UI or public docs
    crossOriginResourcePolicy: { policy: "cross-origin" },
    referrerPolicy: { policy: "no-referrer" },
    hsts: { maxAge: 15552000, includeSubDomains: true, preload: true },
    crossOriginOpenerPolicy: { policy: "same-origin" },
    originAgentCluster: true,
    noSniff: true,
    dnsPrefetchControl: { allow: false },
    frameguard: { action: "deny" },
  })
);

// Advanced CORS configuration
const allowedOrigins = [
  "http://localhost:5173", // local front-end
  "https://your-frontend.example.com", // production front-end
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true); // allow tools like Postman
      return callback(null, allowedOrigins.includes(origin));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Request-ID"],
    exposedHeaders: ["X-Request-ID"],
    credentials: true,
    maxAge: 600, // cache preflight 10 minutes
  })
);

//  Inline health endpoints
app.get("/health", (_req: Request, res: Response) => res.status(200).send("Server is healthy"));
app.get(`${API_PREFIX}/health`, (_req: Request, res: Response) => {
  res.json({
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    version: API_VERSION,
  });
});

//  Feature routes
app.use(`${API_PREFIX}/employees`, employeeRouter());
app.use(`${API_PREFIX}/branches`, branchRouter());

// error handlers
app.use((req: Request, res: Response) => res.status(404).json({ message: "Not Found" }));
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ message: "Internal Server Error" });
});

export default app;
