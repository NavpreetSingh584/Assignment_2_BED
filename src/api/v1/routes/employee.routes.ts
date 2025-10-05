import { Router } from "express";
import * as controller from "../controllers/employee.controller";


export const employeeRouter = () => {
  const r = Router();

  // CREATE / LIST
  r.post("/", controller.createEmployee);
  r.get("/", controller.getEmployees);

  // Put the specific routes BEFORE the param route
  r.get("/by-branch/:branchId", controller.listByBranch);
  r.get("/by-department/:department", controller.listByDepartment);

  // Single item + updates
  r.get("/:id", controller.getEmployeeById);
  r.put("/:id", controller.updateEmployee);
  r.delete("/:id", controller.deleteEmployee);

  return r;
};