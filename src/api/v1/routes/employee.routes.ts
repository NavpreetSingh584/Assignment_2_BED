import { Router } from "express";
import * as ctrl from "../controllers/employee.controller";

export function employeeRouter() {
  const r = Router();

  // CRUD
  r.get("/", ctrl.list);
  r.get("/:id", ctrl.get);
  r.post("/", ctrl.create);
  r.put("/:id", ctrl.update);
  r.delete("/:id", ctrl.remove);

  // Logical operations
  r.get("/by-branch/:branchId", ctrl.listByBranch);
  r.get("/by-department/:department", ctrl.listByDepartment);

  return r;
}