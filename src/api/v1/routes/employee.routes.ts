import { Router } from "express";
import * as controller from "../controllers/employee.controller";
import { validate } from "../middleware/validate";
import { employeeCreateSchema, employeeUpdateSchema } from "../validation/employee.schema";

export const employeeRouter = () => {
  const r = Router();
  r.post("/", validate(employeeCreateSchema), controller.createEmployee);
  r.get("/", controller.getEmployees);
  r.get("/:id", controller.getEmployeeById);
  r.put("/:id", validate(employeeUpdateSchema), controller.updateEmployee);
  r.delete("/:id", controller.deleteEmployee);

  // Optional filters with query validation (example)
  // r.get("/by/branch/:branchId", validate(branchIdSchema, "params"), controller.getByBranch);
  return r;
};
