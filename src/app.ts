import express from "express";
import morgan from "morgan";
import { healthRouter } from "./api/v1/routes/health.routes";
import { employeeRouter } from "./api/v1/routes/employee.routes";
import { branchRouter } from "./api/v1/routes/branch.routes";

export const API_PREFIX = "/api/v1";
export const API_VERSION = "1.0.0";

const app = express();

// Core middleware
app.use(express.json());
app.use(morgan("combined"));

// Routes
app.use(`${API_PREFIX}`, healthRouter(API_VERSION));
app.use(`${API_PREFIX}/employees`, employeeRouter());
app.use(`${API_PREFIX}/branches`, branchRouter());

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Not Found" });
});

// Error handler (basic)
app.use(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
);

export default app;
