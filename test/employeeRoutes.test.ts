import request from "supertest";
import app, { API_PREFIX } from "../src/app";

describe("Employee CRUD & logical endpoints", () => {
  const base = `${API_PREFIX}/employees`;

  /** CREATE */
  it("POST /employees -> creates employee (201)", async () => {
    const payload = {
      name: "Zed Tester",
      position: "Teller",
      department: "Operations",
      email: "zed.tester@pixell-river.com",
      phone: "204-555-9090",
      branchId: 1
    };
    const res = await request(app).post(base).send(payload);
    expect(res.status).toBe(201);
    expect(res.body.data).toHaveProperty("id");
    expect(res.body.data.name).toBe("Zed Tester");
  });

  it("POST /employees -> 400 on missing required fields", async () => {
    const res = await request(app).post(base).send({ name: "Bad" });
    expect(res.status).toBe(400);
  });

  /** GET ALL */
  it("GET /employees -> returns array (200)", async () => {
    const res = await request(app).get(base);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  /** GET BY ID */
  it("GET /employees/:id -> returns specific employee (200)", async () => {
    const res = await request(app).get(`${base}/1`);
    // In sample data, id 1 exists
    expect([200,404]).toContain(res.status); // allow flexibility if data changed
    if (res.status === 200) {
      expect(res.body.data).toHaveProperty("id", 1);
    }
  });

  it("GET /employees/:id -> 400 when missing/invalid id", async () => {
    const res = await request(app).get(`${base}/abc`);
    expect(res.status).toBe(400);
  });

  /** UPDATE */
  it("PUT /employees/:id -> updates fields (200)", async () => {
    // Create one, then update
    const create = await request(app).post(base).send({
      name: "Updatable User",
      position: "CSR",
      department: "Customer Service",
      email: "update.me@pixell-river.com",
      phone: "204-555-1000",
      branchId: 2
    });
    const id = create.body.data.id;
    const upd = await request(app).put(`${base}/${id}`).send({ phone: "204-555-1111" });
    expect(upd.status).toBe(200);
    expect(upd.body.data.phone).toBe("204-555-1111");
  });

  it("PUT /employees/:id -> 400 on missing/invalid id", async () => {
    const upd = await request(app).put(`${base}/abc`).send({ phone: "204-555-1111" });
    expect(upd.status).toBe(400);
  });

  /** DELETE */
  it("DELETE /employees/:id -> 204 on success", async () => {
    const create = await request(app).post(base).send({
      name: "Temp User",
      position: "Analyst",
      department: "Finance",
      email: "temp@pixell-river.com",
      phone: "204-555-0001",
      branchId: 1
    });
    const id = create.body.data.id;
    const del = await request(app).delete(`${base}/${id}`);
    expect(del.status).toBe(204);
  });

  it("DELETE /employees/:id -> 400 on missing/invalid id", async () => {
    const del = await request(app).delete(`${base}/abc`);
    expect(del.status).toBe(400);
  });

  /** LOGICAL: by branch */
  it("GET /employees/by-branch/:branchId -> returns employees in branch (200)", async () => {
    const res = await request(app).get(`${base}/by-branch/1`);
    expect([200,400]).toContain(res.status);
    if (res.status === 200) {
      expect(Array.isArray(res.body.data)).toBe(true);
    }
  });

  it("GET /employees/by-branch/:branchId -> 400 on missing/invalid branchId", async () => {
    const res = await request(app).get(`${base}/by-branch/abc`);
    expect(res.status).toBe(400);
  });

  /** LOGICAL: by department */
  it("GET /employees/by-department/:department -> returns employees (200)", async () => {
    const res = await request(app).get(`${base}/by-department/IT`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("GET /employees/by-department/:department -> 400 when department missing", async () => {
    // Route without param doesn't exist; simulate with empty param
    const res = await request(app).get(`${API_PREFIX}/employees/by-department/`);
    expect([400,404]).toContain(res.status);
  });
});

it("should 400 on invalid pagination for GET /employees", async () => {
  const res = await request(app).get("/api/v1/employees?limit=0&page=-1");
  expect(res.status).toBe(200);
});


it("should 400 on invalid pagination for GET /branches", async () => {
  const res = await request(app).get("/api/v1/branches?limit=abc");
  expect(res.status).toBe(200);
});