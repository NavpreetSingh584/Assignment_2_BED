import { branches } from "../../../data/branches";
import { Branch } from "../models/branch";

export function list(): Branch[] {
  return branches;
}

export function getById(id: number): Branch | undefined {
  return branches.find(b => b.id === id);
}
