import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import { employeeRouter, branchRouter } from "./api/v1/routes";

export const API_PREFIX = "/api/v1";
export const API_VERSION = "1.0.0";

const app = express();
app.use(express.json());
app.use(morgan("combined"));

// Inline health endpoints
app.get("/health", (_req: Request, res: Response) => res.status(200).send("Server is healthy"));
app.get(`${API_PREFIX}/health`, (_req: Request, res: Response) => {
  res.json({
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    version: API_VERSION,
  });
});

// Feature routes
app.use(`${API_PREFIX}/employees`, employeeRouter());
app.use(`${API_PREFIX}/branches`, branchRouter());

// 404 + error handlers
app.use((req: Request, res: Response) => res.status(404).json({ message: "Not Found" }));
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ message: "Internal Server Error" });
});

export default app;
