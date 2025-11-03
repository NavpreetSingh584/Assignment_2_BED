import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { employeeRouter, branchRouter } from "./api/v1/routes";
import { errorHandler } from "./api/v1/middleware/errorHandler";
import { setupSwagger } from "../src/config/swagger"; 

dotenv.config();
export const API_PREFIX = "/api/v1";
export const API_VERSION = "1.0.0";

const app = express();

app.use(morgan("combined"));

app.use(
  helmet({
    contentSecurityPolicy: false,
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

const allowedOrigins = [
  "http://localhost:5173", 
  "https://your-frontend.example.com", 
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true); // allow Postman or curl
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("CORS policy: Origin not allowed"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Request-ID"],
    exposedHeaders: ["X-Request-ID"],
    credentials: true,
    maxAge: 600,
  })
);

const parseJsonIfHasBody = (req: any, res: Response, next: NextFunction) => {
  const methodsNeedingBody = ["POST", "PUT", "PATCH"];
  if (!methodsNeedingBody.includes(req.method)) return next();

  return bodyParser.json({
    strict: true,
    verify: (rq: any, _res, buf: Buffer) => {
      if (buf.length === 0) rq.body = {}; // allow empty bodies
    },
  })(req, res, next);
};

app.use(parseJsonIfHasBody);


app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
  if (err && err.type === "entity.parse.failed") {
    return res.status(400).json({
      success: false,
      message: "Invalid or malformed JSON in request body",
    });
  }
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({
      success: false,
      message: "Invalid or malformed JSON in request body",
    });
  }
  next(err);
});

app.get("/health", (_req: Request, res: Response) =>
  res.status(200).send("Server is healthy")
);

app.get(`${API_PREFIX}/health`, (_req: Request, res: Response) =>
  res.status(200).json({
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    version: API_VERSION,
  })
);


app.use(`${API_PREFIX}/employees`, employeeRouter());
app.use(`${API_PREFIX}/branches`, branchRouter());

setupSwagger(app); 
app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, message: "Not Found" });
});

app.use(errorHandler);

export default app;
