import { Request, Response } from "express";
import * as svc from "../services/branch.service";
import { Branch, BranchCreateDTO, BranchUpdateDTO } from "../models/branch";
import { ok, created, listOk, notFound, badRequest, noContent } from "../models/respond";

export function list(_req: Request, res: Response) {
  const branches = svc.list() as Branch[];
  return listOk(res, branches, "Branches retrieved", branches.length);
}

export function get(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return badRequest(res, "Missing or invalid id parameter");

  const found = svc.getById(id) as Branch | undefined;
  if (!found) return notFound(res, "Branch not found");

  return ok(res, found, "Branch retrieved");
}

export function create(req: Request, res: Response) {
  const { name, address, phone } = req.body ?? {};
  if (!name || !address || !phone) return badRequest(res, "Missing required fields");

  const branch = svc.create({ name, address, phone } as BranchCreateDTO);
  return created(res, branch, "Branch created");
}

export function update(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return badRequest(res, "Missing or invalid id parameter");

  const patch = { ...(req.body ?? {}) } as BranchUpdateDTO;
  if ((patch as any).id !== undefined) delete (patch as any).id;

  const updated = svc.update(id, patch) as Branch | undefined;
  if (!updated) return notFound(res, "Branch not found");

  return ok(res, updated, "Branch updated");
}

export function remove(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return badRequest(res, "Missing or invalid id parameter");

  const deleted = svc.remove(id);
  if (!deleted) return notFound(res, "Branch not found");

  return noContent(res);
}

/** ✅ Aliases to match your routes */
export {
  create as createBranch,
  list as getBranches,
  get as getBranchById,
  update as updateBranch,
  remove as deleteBranch,
};
