import { Request, Response } from "express";
import * as svc from "../services/employee.service";

/** GET /employees */
export function list(_req: Request, res: Response) {
  res.json({ data: svc.list() });
}

/** GET /employees/:id */
export function get(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ message: "Missing or invalid id parameter" });
  }
  const found = svc.getById(id);
  if (!found) return res.status(404).json({ message: "Employee not found" });
  res.json({ data: found });
}

/** POST /employees */
export function create(req: Request, res: Response) {
  const { name, position, department, email, phone, branchId } = req.body ?? {};
  if (!name || !position || !department || !email || !phone || typeof branchId !== "number") {
    return res.status(400).json({ message: "Missing required fields" });
  }
  const employee = svc.create({ name, position, department, email, phone, branchId });
  res.status(201).json({ message: "Employee created", data: employee });
}

/** PUT /employees/:id */
export function update(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ message: "Missing or invalid id parameter" });
  }
  const patch = { ...(req.body ?? {}) };
  if (patch.id !== undefined) delete patch.id;

  const updated = svc.update(id, patch);
  if (!updated) return res.status(404).json({ message: "Employee not found" });
  res.json({ message: "Employee updated", data: updated });
}

/** DELETE /employees/:id */
export function remove(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ message: "Missing or invalid id parameter" });
  }
  const ok = svc.remove(id);
  if (!ok) return res.status(404).json({ message: "Employee not found" });
  res.status(204).send();
}

/** GET /employees/by-branch/:branchId */
export function listByBranch(req: Request, res: Response) {
  const branchId = Number(req.params.branchId);        
  if (Number.isNaN(branchId)) {
    return res.status(400).json({ message: "Missing or invalid branchId parameter" });
  }
  res.json({ data: svc.listByBranchId(branchId) });    
}

export function listByDepartment(req: Request, res: Response) {
  const department = String(req.params.department ?? "").trim(); 
  if (!department) {
    return res.status(400).json({ message: "Missing department parameter" });
  }
  res.json({ data: svc.listByDepartment(department) }); 
}

/** ✅ Aliases to match your routes */
export {
  create as createEmployee,
  list as getEmployees,
  get as getEmployeeById,
  update as updateEmployee,
  remove as deleteEmployee,
};
