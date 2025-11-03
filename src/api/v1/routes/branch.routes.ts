/*
  branch.routes.ts
*/
import { Router } from "express";
import * as controller from "../controllers/branch.controller";
import { validate } from "../middleware/validate";
import { branchCreateSchema, branchUpdateSchema } from "../validation/branch.schema";

export const branchRouter = () => {
  const r = Router();

  /**
   * @openapi
   * /api/v1/branches:
   *   post:
   *     summary: Create a new branch
   *     tags: [Branches]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/BranchCreate'
   *     responses:
   *       201:
   *         description: Branch created successfully
   */
  r.post("/", validate(branchCreateSchema), controller.createBranch);

  /**
   * @openapi
   * /api/v1/branches:
   *   get:
   *     summary: Get all branches
   *     tags: [Branches]
   *     responses:
   *       200:
   *         description: List of branches
   */
  r.get("/", controller.getBranches);

  /**
   * @openapi
   * /api/v1/branches/{id}:
   *   get:
   *     summary: Get branch by ID
   *     tags: [Branches]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Branch ID
   *     responses:
   *       200:
   *         description: Branch details
   *       404:
   *         description: Branch not found
   */
  r.get("/:id", controller.getBranchById);

  /**
   * @openapi
   * /api/v1/branches/{id}:
   *   put:
   *     summary: Update branch details
   *     tags: [Branches]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Branch ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/BranchUpdate'
   *     responses:
   *       200:
   *         description: Branch updated successfully
   *       400:
   *         description: Invalid request
   */
  r.put("/:id", validate(branchUpdateSchema), controller.updateBranch);

  /**
   * @openapi
   * /api/v1/branches/{id}:
   *   delete:
   *     summary: Delete a branch
   *     tags: [Branches]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Branch ID
   *     responses:
   *       200:
   *         description: Branch deleted successfully
   *       404:
   *         description: Branch not found
   */
  r.delete("/:id", controller.deleteBranch);

  return r;
};
