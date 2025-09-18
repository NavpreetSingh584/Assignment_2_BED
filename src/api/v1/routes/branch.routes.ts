import { Router } from "express";
import * as ctrl from "../controllers/branch.controller";

export function branchRouter() {
  const r = Router();

  // CRUD
  r.get("/", ctrl.list);
  r.get("/:id", ctrl.get);
  r.post("/", ctrl.create);
  r.put("/:id", ctrl.update);
  r.delete("/:id", ctrl.remove);

  return r;
}
