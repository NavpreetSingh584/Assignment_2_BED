import { Router } from "express";
import * as controller from "../controllers/employee.controller";
// import { validate } from "../middleware/validate";
// import { employeeCreateSchema, employeeUpdateSchema } from "../validation/employee.schema";

export const employeeRouter = () => {
  const r = Router();

  // CRUD
  // r.post("/", validate(employeeCreateSchema), controller.createEmployee);
  r.post("/", controller.createEmployee);
  r.get("/", controller.getEmployees);
  r.get("/:id", controller.getEmployeeById);
  // r.put("/:id", validate(employeeUpdateSchema), controller.updateEmployee);
  r.put("/:id", controller.updateEmployee);
  r.delete("/:id", controller.deleteEmployee);

  // Add these logical routes so tests stop 404-ing
  r.get("/by-branch/:branchId", controller.listByBranch);
  r.get("/by-department/:department", controller.listByDepartment);

  return r;
};
