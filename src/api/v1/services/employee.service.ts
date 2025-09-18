import { employees } from "../../../data/employees";
import type { Employee } from "../models/employee";

export function list(): Employee[] {
  return employees;
}

export function getById(id: number): Employee | undefined {
  return employees.find(e => e.id === id);
}

export function create(payload: Omit<Employee, "id">): Employee {
  const nextId = Math.max(0, ...employees.map(e => e.id)) + 1;
  const emp: Employee = { id: nextId, ...payload };
  employees.push(emp);
  return emp;
}
export function update(
  id: number,
  patch: Partial<Omit<Employee, "id">>
): Employee | undefined {
  const idx = employees.findIndex(e => e.id === id);
  if (idx === -1) return undefined;
  employees[idx] = { ...employees[idx], ...patch, id };
  return employees[idx];
}

export function remove(id: number): boolean {
  const idx = employees.findIndex(e => e.id === id);
  if (idx === -1) return false;
  employees.splice(idx, 1);
  return true;
}

/** Logical queries */
export function listByBranchId(branchId: number): Employee[] {
  return employees.filter(e => e.branchId === branchId);
}

export function listByDepartment(department: string): Employee[] {
  const d = department.toLowerCase();
  return employees.filter(e => e.department.toLowerCase() === d);
}
export const listByBranch = listByBranchId;
