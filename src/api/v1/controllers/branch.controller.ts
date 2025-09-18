import { Request, Response } from "express";
import * as svc from "../services/branch.service";

export function list(_req: Request, res: Response) {
  res.json({ data: svc.list() });
}

export function get(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ message: "Missing or invalid id parameter" });
  const found = svc.getById(id);
  if (!found) return res.status(404).json({ message: "Branch not found" });
  res.json({ data: found });
}

export function create(req: Request, res: Response) {
  const { name, address, phone } = req.body ?? {};
  if (!name || !address || !phone) return res.status(400).json({ message: "Missing required fields" });
  const branch = svc.create({ name, address, phone });
  res.status(201).json({ message: "Branch created", data: branch });
}

export function update(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ message: "Missing or invalid id parameter" });
  const patch = { ...(req.body ?? {}) };
  if (patch.id !== undefined) delete patch.id;
  const updated = svc.update(id, patch);
  if (!updated) return res.status(404).json({ message: "Branch not found" });
  res.json({ message: "Branch updated", data: updated });
}

export function remove(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ message: "Missing or invalid id parameter" });
  const ok = svc.remove(id);
  if (!ok) return res.status(404).json({ message: "Branch not found" });
  res.status(204).send();
}
