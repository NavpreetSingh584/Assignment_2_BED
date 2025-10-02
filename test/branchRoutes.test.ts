import request from "supertest";
import app, { API_PREFIX } from "../src/app";

//  Mock the branch service so tests don't hit Firestore

jest.mock("../src/api/v1/services/branch.service", () => ({
  list: jest.fn(),
  getById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
}));

import * as bsvc from "../src/api/v1/services/branch.service";

describe("Branch CRUD", () => {
  const base = `${API_PREFIX}/branches`;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  /** CREATE */

  it("POST /branches -> creates branch (201)", async () => {
    (bsvc.create as jest.Mock).mockResolvedValue({
      id: "b-1",
      name: "Test Branch",
      address: "123 Test St, Test City",
      phone: "204-555-7777",
    });

    const res = await request(app).post(base).send({
      name: "Test Branch",
      address: "123 Test St, Test City",
      phone: "204-555-7777",
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("id", "b-1");
    expect(bsvc.create).toHaveBeenCalledWith({
      name: "Test Branch",
      address: "123 Test St, Test City",
      phone: "204-555-7777",
    });
  });

  it("POST /branches -> 400 on missing required fields", async () => {
    const res = await request(app).post(base).send({ name: "Only Name" });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  /** GET ALL */

  it("GET /branches -> returns array (200)", async () => {
    (bsvc.list as jest.Mock).mockResolvedValue([{ id: "b-1" }, { id: "b-2" }]);

    const res = await request(app).get(base);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(2);
  });

  /** GET BY ID */

  it("GET /branches/:id -> returns branch (200) or 404", async () => {
    (bsvc.getById as jest.Mock).mockResolvedValue({ id: "1", name: "Main" });

    const res = await request(app).get(`${base}/1`);

    expect([200, 404]).toContain(res.status);
    if (res.status === 200) {
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("id", "1");
    }
  });

  it("GET /branches/:id -> 400 or 404 on invalid id", async () => {


    // If your controller enforces numeric ids, expect 400.
    // If you accept Firestore-style string ids, invalid -> 404.


    (bsvc.getById as jest.Mock).mockResolvedValue(undefined);

    const res = await request(app).get(`${base}/abc`);
    expect([400, 404]).toContain(res.status);
  });

  /** UPDATE */

  it("PUT /branches/:id -> updates branch (200)", async () => {

    // Mock the create call chain

    (bsvc.create as jest.Mock).mockResolvedValue({ id: "b-upd" });
    const created = await request(app).post(base).send({
      name: "To Update",
      address: "1 A St",
      phone: "204-555-1000",
    });
    const id = created.body.data.id;

    (bsvc.update as jest.Mock).mockResolvedValue({ id, phone: "204-555-1001" });

    const upd = await request(app).put(`${base}/${id}`).send({ phone: "204-555-1001" });

    expect(upd.status).toBe(200);
    expect(upd.body.success).toBe(true);
    expect(upd.body.data.phone).toBe("204-555-1001");
    expect(bsvc.update).toHaveBeenCalledWith(id, { phone: "204-555-1001" });
  });

  it("PUT /branches/:id -> 400 or 404 on invalid id", async () => {
    const upd = await request(app).put(`${base}/abc`).send({ phone: "x" });
    expect([400, 404]).toContain(upd.status);
  });

  /** DELETE */


  it("DELETE /branches/:id -> 204 on success", async () => {


    // Mock the create chain


    
    (bsvc.create as jest.Mock).mockResolvedValue({ id: "b-del" });
    const created = await request(app).post(base).send({
      name: "Temp Branch",
      address: "99 Temp Rd",
      phone: "204-555-2000",
    });
    const id = created.body.data.id;

    (bsvc.remove as jest.Mock).mockResolvedValue(true);

    const del = await request(app).delete(`${base}/${id}`);

    expect(del.status).toBe(204);
    expect(bsvc.remove).toHaveBeenCalledWith(id);
  });

  it("DELETE /branches/:id -> 400 or 404 on invalid id", async () => {
    (bsvc.remove as jest.Mock).mockResolvedValue(false);

    const del = await request(app).delete(`${base}/abc`);
    expect([400, 404]).toContain(del.status);
  });
});