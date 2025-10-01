
export {
  create as createBranch,
  list as getBranches,
  get as getBranchById,
  update as updateBranch,
  remove as deleteBranch,
};



import { Request, Response } from "express";
import * as svc from "../services/branch.service";
import { Branch, BranchCreateDTO, BranchUpdateDTO } from "../models/branch";
import { ok, created, listOk, notFound, badRequest, noContent, serverError } from "../models/respond";

/** GET /branches */
export async function list(_req: Request, res: Response) {
  try {
    const branches = await svc.list();                                     // Promise<Branch[]>
    return listOk(res, branches as Branch[], "Branches retrieved", branches.length);
  } catch (e: any) {
    return serverError(res, e?.message ?? "Failed to list branches");
  }
}

/** GET /branches/:id */
export async function get(req: Request, res: Response) {
  try {
    const id = req.params.id;                                              // Firestore ids are strings
    if (!id) return badRequest(res, "Missing or invalid id parameter");

    const found = await svc.getById(id);                                    // Promise<Branch | undefined>
    if (!found) return notFound(res, "Branch not found");
    return ok(res, found as Branch, "Branch retrieved");
  } catch (e: any) {
    return serverError(res, e?.message ?? "Failed to get branch");
  }
}

/** POST /branches */
export async function create(req: Request, res: Response) {
  try {
    const { name, address, phone } = req.body ?? {};
    if (!name || !address || !phone) return badRequest(res, "Missing required fields");

    const dto: BranchCreateDTO = { name, address, phone };
    const branch = await svc.create(dto);                                    // Promise<Branch>
    return created(res, branch as Branch, "Branch created");
  } catch (e: any) {
    return serverError(res, e?.message ?? "Failed to create branch");
  }
}

/** PUT /branches/:id */
export async function update(req: Request, res: Response) {
  try {
    const id = req.params.id;
    if (!id) return badRequest(res, "Missing or invalid id parameter");

    const patch = { ...(req.body ?? {}) } as BranchUpdateDTO;
    if ((patch as any).id !== undefined) delete (patch as any).id;

    const updated = await svc.update(id, patch);                            // Promise<Branch | undefined>
    if (!updated) return notFound(res, "Branch not found");
    return ok(res, updated as Branch, "Branch updated");
  } catch (e: any) {
    return serverError(res, e?.message ?? "Failed to update branch");
  }
}

/** DELETE /branches/:id */
export async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id;
    if (!id) return badRequest(res, "Missing or invalid id parameter");

    const deleted = await svc.remove(id);                                      // Promise<boolean>
    if (!deleted) return notFound(res, "Branch not found");
    return noContent(res);
  } catch (e: any) {
    return serverError(res, e?.message ?? "Failed to delete branch");
  }
}


