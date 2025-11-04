import { Employee, EmployeeCreateDTO, EmployeeUpdateDTO } from "../models/employee";
import * as repo from "../repositories/firestore.repository";

const COLLECTION = "employees";

export const create = async (dto: EmployeeCreateDTO): Promise<Employee> => {
  try {
    return await repo.createDocument<Employee>(COLLECTION, dto as any);
  } catch (e:any) {
    throw new Error("DB create failed: " + (e?.message ?? e));
  }
};

export const list = async (): Promise<Employee[]> => {
  try {
    return await repo.getDocuments<Employee>(COLLECTION);
  } catch (e:any) {
    throw new Error("DB read failed: " + (e?.message ?? e));
  }
};

export const getById = async (id: number | string): Promise<Employee | undefined> => {
  try {
    const doc = await repo.getDocumentById<Employee>(COLLECTION, String(id));
    return doc ?? undefined;
  } catch (e:any) {
    throw new Error("DB read failed: " + (e?.message ?? e));
  }
};

export const update = async (id: number | string, patch: EmployeeUpdateDTO): Promise<Employee | undefined> => {
  try {
    const updated = await repo.updateDocument<Employee>(COLLECTION, String(id), patch);
    return updated ?? undefined;
  } catch (e:any) {
    throw new Error("DB update failed: " + (e?.message ?? e));
  }
};

export const remove = async (id: number | string): Promise<boolean> => {
  try {
    return await repo.deleteDocument(COLLECTION, String(id));
  } catch (e:any) {
    throw new Error("DB delete failed: " + (e?.message ?? e));
  }
};

/** Simple in-memory filter after fetch (keeps repo generic) */
export const listByBranchId = async (branchId: number): Promise<Employee[]> => {
  const all = await list();
  return all.filter(e => String(e.branchId) === String(branchId));
};

export const listByDepartment = async (department: string): Promise<Employee[]> => {
  const all = await list();
  return all.filter(e => (e.department || "").toLowerCase() === department.toLowerCase());
};
