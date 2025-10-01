

export {
  create as createEmployee,
  list as getEmployees,
  get as getEmployeeById,
  update as updateEmployee,
  remove as deleteEmployee,
};


import { Request, Response } from "express";
import * as svc from "../services/employee.service";
import { Employee, EmployeeCreateDTO, EmployeeUpdateDTO } from "../models/employee";
import { ok, created, listOk, notFound, badRequest, noContent, serverError } from "../models/respond";

/** GET /employees */
export async function list(_req: Request, res: Response) {
  try {
    const items = await svc.list();                 // Promise<Employee[]>
    return listOk(res, items as Employee[], "Employees retrieved", items.length);
  } catch (e: any) {
    return serverError(res, e?.message ?? "Failed to list employees");
  }
}

/** GET /employees/:id */
export async function get(req: Request, res: Response) {
  try {
    const id = req.params.id;                       // Firestore ids are strings
    if (!id) return badRequest(res, "Missing or invalid id parameter");

    const found = await svc.getById(id);            // Promise<Employee | undefined>
    if (!found) return notFound(res, "Employee not found");
    return ok(res, found as Employee, "Employee retrieved");
  } catch (e: any) {
    return serverError(res, e?.message ?? "Failed to get employee");
  }
}

/** POST /employees */
export async function create(req: Request, res: Response) {
  try {
    const { name, position, department, email, phone, branchId } = req.body ?? {};
    if (!name || !position || !department || !email || !phone || branchId === undefined) {
      return badRequest(res, "Missing required fields");
    }
    const dto: EmployeeCreateDTO = { name, position, department, email, phone, branchId };
    const employee = await svc.create(dto);         // Promise<Employee>
    return created(res, employee as Employee, "Employee created");
  } catch (e: any) {
    return serverError(res, e?.message ?? "Failed to create employee");
  }
}

/** PUT /employees/:id */
export async function update(req: Request, res: Response) {
  try {
    const id = req.params.id;
    if (!id) return badRequest(res, "Missing or invalid id parameter");

    const patch = { ...(req.body ?? {}) } as EmployeeUpdateDTO;
    if ((patch as any).id !== undefined) delete (patch as any).id;

    const updated = await svc.update(id, patch);    // Promise<Employee | undefined>
    if (!updated) return notFound(res, "Employee not found");
    return ok(res, updated as Employee, "Employee updated");
  } catch (e: any) {
    return serverError(res, e?.message ?? "Failed to update employee");
  }
}

/** DELETE /employees/:id */
export async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id;
    if (!id) return badRequest(res, "Missing or invalid id parameter");

    const okDel = await svc.remove(id);             // Promise<boolean>
    if (!okDel) return notFound(res, "Employee not found");
    return noContent(res);
  } catch (e: any) {
    return serverError(res, e?.message ?? "Failed to delete employee");
  }
}

/** GET /employees/by-branch/:branchId */
export async function listByBranch(req: Request, res: Response) {
  try {
    const branchId = req.params.branchId;
    if (!branchId) return badRequest(res, "Missing or invalid branchId parameter");

    const items = await svc.listByBranchId(Number(branchId)); // Promise<Employee[]>
    return listOk(res, items as Employee[], "Employees by branch", items.length);
  } catch (e: any) {
    return serverError(res, e?.message ?? "Failed to list by branch");
  }
}

/** GET /employees/by-department/:department */
export async function listByDepartment(req: Request, res: Response) {
  try {
    const department = String(req.params.department ?? "").trim();
    if (!department) return badRequest(res, "Missing department parameter");

    const items = await svc.listByDepartment(department); // Promise<Employee[]>
    return listOk(res, items as Employee[], "Employees by department", items.length);
  } catch (e: any) {
    return serverError(res, e?.message ?? "Failed to list by department");
  }
}



