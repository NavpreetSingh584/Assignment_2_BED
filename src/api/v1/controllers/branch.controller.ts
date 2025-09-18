// src/api/v1/services/branch.service.ts
import { branches } from "../../../data/branches";
import type { Branch } from "../models/branch";

export function list(): Branch[] {
  return branches;
}

export function getById(id: number): Branch | undefined {
  return branches.find(b => b.id === id);
}

export function create(payload: Omit<Branch, "id">): Branch {
  const nextId = Math.max(0, ...branches.map(b => b.id)) + 1;
  const branch: Branch = { id: nextId, ...payload };
  branches.push(branch);
  return branch;
}

export function update(
  id: number,
  patch: Partial<Omit<Branch, "id">>
): Branch | undefined {
  const idx = branches.findIndex(b => b.id === id);
  if (idx === -1) return undefined;
  branches[idx] = { ...branches[idx], ...patch, id };
  return branches[idx];
}

export function remove(id: number): boolean {
  const idx = branches.findIndex(b => b.id === id);
  if (idx === -1) return false;
  branches.splice(idx, 1);
  return true;
}
