/*
  employee.routes.ts
*/
import { Router } from "express";
import * as controller from "../controllers/employee.controller";
import { validate } from "../middleware/validate";
import { employeeCreateSchema, employeeUpdateSchema } from "../validation/employee.schema";

export const employeeRouter = () => {
  const router = Router();

  /**
   * @openapi
   * /api/v1/employees:
   *   post:
   *     summary: Create a new employee
   *     tags: [Employees]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/EmployeeCreate'
   *     responses:
   *       201:
   *         description: Employee created successfully
   */
  router.post("/", validate(employeeCreateSchema), controller.createEmployee);

  /**
   * @openapi
   * /api/v1/employees:
   *   get:
   *     summary: Get all employees
   *     tags: [Employees]
   *     responses:
   *       200:
   *         description: List of employees
   */
  router.get("/", controller.getEmployees);

  /**
   * @openapi
   * /api/v1/employees/by-branch/{branchId}:
   *   get:
   *     summary: Get employees by branch ID
   *     tags: [Employees]
   *     parameters:
   *       - in: path
   *         name: branchId
   *         required: true
   *         schema:
   *           type: string
   *         description: Branch ID
   *     responses:
   *       200:
   *         description: List of employees for the specified branch
   */
  router.get("/by-branch/:branchId", controller.listByBranch);

  /**
   * @openapi
   * /api/v1/employees/by-department/{department}:
   *   get:
   *     summary: Get employees by department name
   *     tags: [Employees]
   *     parameters:
   *       - in: path
   *         name: department
   *         required: true
   *         schema:
   *           type: string
   *         description: Department name
   *     responses:
   *       200:
   *         description: List of employees in the specified department
   */
  router.get("/by-department/:department", controller.listByDepartment);

  /**
   * @openapi
   * /api/v1/employees/{id}:
   *   get:
   *     summary: Get employee by ID
   *     tags: [Employees]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Employee ID
   *     responses:
   *       200:
   *         description: Employee details
   *       404:
   *         description: Employee not found
   */
  router.get("/:id", controller.getEmployeeById);

  /**
   * @openapi
   * /api/v1/employees/{id}:
   *   put:
   *     summary: Update employee details
   *     tags: [Employees]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Employee ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/EmployeeUpdate'
   *     responses:
   *       200:
   *         description: Employee updated successfully
   *       400:
   *         description: Invalid request data
   */
  router.put("/:id", validate(employeeUpdateSchema), controller.updateEmployee);

  /**
   * @openapi
   * /api/v1/employees/{id}:
   *   delete:
   *     summary: Delete an employee
   *     tags: [Employees]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Employee ID
   *     responses:
   *       200:
   *         description: Employee deleted successfully
   *       404:
   *         description: Employee not found
   */
  router.delete("/:id", controller.deleteEmployee);

  return router;
};
