import { Request, Response } from "express";
import * as svc from "../services/employee.service";
import { Employee, EmployeeCreateDTO, EmployeeUpdateDTO } from "../models/employee";
import { ok, created, listOk, notFound, badRequest, noContent } from "../models/respond";

/** GET /employees */
export function list(_req: Request, res: Response) {
  const employees = svc.list() as Employee[];
  return listOk(res, employees, "Employees retrieved", employees.length);
}

/** GET /employees/:id */
export function get(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return badRequest(res, "Missing or invalid id parameter");
  }
  const found = svc.getById(id) as Employee | undefined;
  if (!found) return notFound(res, "Employee not found");
  return ok(res, found, "Employee retrieved");
}

/** POST /employees */
export function create(req: Request, res: Response) {
  const { name, position, department, email, phone, branchId } = req.body ?? {};
  if (!name || !position || !department || !email || !phone || typeof branchId !== "number") {
    return badRequest(res, "Missing required fields");
  }
  const employee = svc.create({ name, position, department, email, phone, branchId } as EmployeeCreateDTO);
  return created(res, employee, "Employee created");
}

/** PUT /employees/:id */
export function update(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return badRequest(res, "Missing or invalid id parameter");
  }
  const patch = { ...(req.body ?? {}) } as EmployeeUpdateDTO;
  if ((patch as any).id !== undefined) delete (patch as any).id;

  const updated = svc.update(id, patch) as Employee | undefined;
  if (!updated) return notFound(res, "Employee not found");
  return ok(res, updated, "Employee updated");
}

/** DELETE /employees/:id */
export function remove(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return badRequest(res, "Missing or invalid id parameter");
  }
  const deleted = svc.remove(id);
  if (!deleted) return notFound(res, "Employee not found");
  return noContent(res);
}

/** GET /employees/by-branch/:branchId */
export function listByBranch(req: Request, res: Response) {
  const branchId = Number(req.params.branchId);
  if (Number.isNaN(branchId)) {
    return badRequest(res, "Missing or invalid branchId parameter");
  }
  const employees = svc.listByBranchId(branchId) as Employee[];
  return listOk(res, employees, "Employees by branch", employees.length);
}

/** GET /employees/by-department/:department */
export function listByDepartment(req: Request, res: Response) {
  const department = String(req.params.department ?? "").trim();
  if (!department) {
    return badRequest(res, "Missing department parameter");
  }
  const employees = svc.listByDepartment(department) as Employee[];
  return listOk(res, employees, "Employees by department", employees.length);
}

/** ✅ Aliases to match your routes */
export {
  create as createEmployee,
  list as getEmployees,
  get as getEmployeeById,
  update as updateEmployee,
  remove as deleteEmployee,
};
