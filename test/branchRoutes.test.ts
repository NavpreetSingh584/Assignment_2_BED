import request from "supertest";
import app, { API_PREFIX } from "../src/app";

describe("Branch CRUD", () => {
  const base = `${API_PREFIX}/branches`;

  /** CREATE */
  it("POST /branches -> creates branch (201)", async () => {
    const res = await request(app).post(base).send({
      name: "Test Branch",
      address: "123 Test St, Test City",
      phone: "204-555-7777"
    });
    expect(res.status).toBe(201);
    expect(res.body.data).toHaveProperty("id");
  });

  it("POST /branches -> 400 on missing required fields", async () => {
    const res = await request(app).post(base).send({ name: "Only Name" });
    expect(res.status).toBe(400);
  });

  /** GET ALL */
  it("GET /branches -> returns array (200)", async () => {
    const res = await request(app).get(base);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  /** GET BY ID */
  it("GET /branches/:id -> returns branch (200)", async () => {
    const res = await request(app).get(`${base}/1`);
    expect([200,404]).toContain(res.status);
    if (res.status === 200) {
      expect(res.body.data).toHaveProperty("id", 1);
    }
  });

  it("GET /branches/:id -> 400 on missing/invalid id", async () => {
    const res = await request(app).get(`${base}/abc`);
    expect(res.status).toBe(400);
  });

  /** UPDATE */
  it("PUT /branches/:id -> updates branch (200)", async () => {
    const create = await request(app).post(base).send({
      name: "To Update",
      address: "1 A St",
      phone: "204-555-1000"
    });
    const id = create.body.data.id;
    const upd = await request(app).put(`${base}/${id}`).send({ phone: "204-555-1001" });
    expect(upd.status).toBe(200);
    expect(upd.body.data.phone).toBe("204-555-1001");
  });

  it("PUT /branches/:id -> 400 on missing/invalid id", async () => {
    const upd = await request(app).put(`${base}/abc`).send({ phone: "x" });
    expect(upd.status).toBe(400);
  });

  /** DELETE */
  it("DELETE /branches/:id -> 204 on success", async () => {
    const create = await request(app).post(base).send({
      name: "Temp Branch",
      address: "99 Temp Rd",
      phone: "204-555-2000"
    });
    const id = create.body.data.id;
    const del = await request(app).delete(`${base}/${id}`);
    expect(del.status).toBe(204);
  });

  it("DELETE /branches/:id -> 400 on missing/invalid id", async () => {
    const del = await request(app).delete(`${base}/abc`);
    expect(del.status).toBe(400);
  });
});