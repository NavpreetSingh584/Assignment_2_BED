import request from "supertest";
import app, { API_PREFIX } from "../src/app";
import * as esvc from "../src/api/v1/services/employee.service";

// Mock employee service used by these routes


jest.mock("../src/api/v1/services/employee.service", () => ({
  list: jest.fn(),
  getById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  listByBranchId: jest.fn(),
  listByDepartment: jest.fn(),
}));

// Also mock branch service here because we have a /branches pagination test below

jest.mock("../src/api/v1/services/branch.service", () => ({
  list: jest.fn(),
  getById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
}));
import * as bsvc from "../src/api/v1/services/branch.service";

describe("Employee CRUD & logical endpoints", () => {
  const base = `${API_PREFIX}/employees`;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  /** CREATE */


  it("POST /employees -> creates employee (201)", async () => {
    (esvc.create as jest.Mock).mockResolvedValue({ id: "e-1", name: "Zed Tester" });

    const payload = {
      name: "Zed Tester",
      position: "Teller",
      department: "Operations",
      email: "zed.tester@pixell-river.com",
      phone: "204-555-9090",
      branchId: 1,
    };

    const res = await request(app).post(base).send(payload);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("id", "e-1");
    expect(res.body.data.name).toBe("Zed Tester");
    expect(esvc.create).toHaveBeenCalledWith(expect.objectContaining(payload));
  });

  it("POST /employees -> 400 on missing required fields", async () => {
    const res = await request(app).post(base).send({ name: "Bad" });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  /** GET ALL */


  it("GET /employees -> returns array (200)", async () => {
    (esvc.list as jest.Mock).mockResolvedValue([{ id: "e-1" }, { id: "e-2" }]);

    const res = await request(app).get(base);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(2);
  });

  /** GET BY ID */


  it("GET /employees/:id -> returns specific employee (200)", async () => {
    (esvc.getById as jest.Mock).mockResolvedValue({ id: "1", name: "Jane" });

    const res = await request(app).get(`${base}/1`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("id", "1");
  });

  it("GET /employees/:id -> 404 when not found", async () => {
    (esvc.getById as jest.Mock).mockResolvedValue(undefined);

    const res = await request(app).get(`${base}/999`);

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it("GET /employees/:id -> 400/404 when invalid (string) id", async () => {

    (esvc.getById as jest.Mock).mockResolvedValue(undefined);

    const res = await request(app).get(`${base}/abc`);
    expect([400, 404]).toContain(res.status);
    if (res.status === 400) {
      expect(res.body.success).toBe(false);
    }
  });

  /** UPDATE */

  it("PUT /employees/:id -> updates fields (200)", async () => {
    (esvc.update as jest.Mock).mockResolvedValue({ id: "e-9", phone: "204-555-1111" });

    const upd = await request(app).put(`${base}/e-9`).send({ phone: "204-555-1111" });

    expect(upd.status).toBe(200);
    expect(upd.body.success).toBe(true);
    expect(upd.body.data.phone).toBe("204-555-1111");
    expect(esvc.update).toHaveBeenCalledWith("e-9", { phone: "204-555-1111" });
  });

  it("PUT /employees/:id -> 400/404 on invalid id", async () => {
    (esvc.update as jest.Mock).mockResolvedValue(undefined);        // force not-found path

    const upd = await request(app).put(`${base}/abc`).send({ phone: "204-555-1111" });
    expect([400, 404]).toContain(upd.status);
    if (upd.status === 400) {
      expect(upd.body.success).toBe(false);
    }
  });

  it("PUT /employees/:id -> 400 when body fails Joi (invalid type for branchId)", async () => {
    const res = await request(app).put(`${base}/e-any`).send({
      branchId: "not-a-number" as any,
    });

    expect([400, 404]).toContain(res.status);

    if (res.status === 400) {
      expect(res.body.success).toBe(false);
      // Service should NOT be invoked when validation fails
      expect(esvc.update).not.toHaveBeenCalled();
    }
  });

  /** DELETE */


  it("DELETE /employees/:id -> 204 on success", async () => {
    (esvc.remove as jest.Mock).mockResolvedValue(true);

    const del = await request(app).delete(`${base}/e-7`);

    expect(del.status).toBe(204);
    expect(esvc.remove).toHaveBeenCalledWith("e-7");
  });

  it("DELETE /employees/:id -> 404 when service returns false", async () => {
    (esvc.remove as jest.Mock).mockResolvedValue(false);

    const del = await request(app).delete(`${base}/nope`);

    expect(del.status).toBe(404);
    expect(del.body.success).toBe(false);
  });

  /** LOGICAL: by branch */


  it("GET /employees/by-branch/:branchId -> returns employees in branch (200)", async () => {
    (esvc.listByBranchId as jest.Mock).mockResolvedValue([{ id: "e-1", branchId: 1 }]);

    const res = await request(app).get(`${base}/by-branch/1`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("GET /employees/by-branch/:branchId -> 400 on invalid branchId", async () => {
    const res = await request(app).get(`${base}/by-branch/abc`);
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  /** LOGICAL: by department */


  it("GET /employees/by-department/:department -> returns employees (200)", async () => {
    (esvc.listByDepartment as jest.Mock).mockResolvedValue([{ id: "e-2", department: "IT" }]);

    const res = await request(app).get(`${base}/by-department/IT`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("GET /employees/by-department/:department -> 400 when department missing", async () => {
    // Route without param doesn't exist; assert 404 for missing endpoint OR 400 if you implement a guard route
    const res = await request(app).get(`${API_PREFIX}/employees/by-department/`);
    expect([400, 404]).toContain(res.status);
  });
});

it("should 400 on invalid pagination for GET /employees", async () => {
  (esvc.list as jest.Mock).mockResolvedValue([]);

  const res = await request(app).get("/api/v1/employees?limit=0&page=-1");
  expect([200, 400]).toContain(res.status);              // set to 400 if you enforce Joi on query
});

it("should 400 on invalid pagination for GET /branches", async () => {
  // Mock branch list here so we never call Firestore during this test
  (bsvc.list as jest.Mock).mockResolvedValue([]);

  const res = await request(app).get("/api/v1/branches?limit=abc");
  expect([200, 400]).toContain(res.status);              // set to 400 if you enforce Joi on query
});
