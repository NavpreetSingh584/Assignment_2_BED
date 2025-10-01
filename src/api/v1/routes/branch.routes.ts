// ✅ src/api/v1/routes/branch.routes.ts
import { Router } from "express";
import * as controller from "../controllers/branch.controller";
import { validate } from "../middleware/validate";
import { branchCreateSchema, branchUpdateSchema } from "../validation/branch.schema";

export const branchRouter = () => {
  const r = Router();
  r.post("/", validate(branchCreateSchema), controller.createBranch);
  r.get("/", controller.getBranches);
  r.get("/:id", controller.getBranchById);
  r.put("/:id", validate(branchUpdateSchema), controller.updateBranch);
  r.delete("/:id", controller.deleteBranch);
  return r;
};
