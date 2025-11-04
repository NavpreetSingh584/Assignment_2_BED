import { employeeCreateSchema, employeeUpdateSchema } from "../src/api/v1/validation/employee.schema";

describe("validation/employee.schema", () => {
  it("create schema → valid payload passes", () => {
    const { error } = employeeCreateSchema.validate({
      name: "Ada Lovelace",
      position: "Engineer",
      department: "R&D",
      email: "ada@example.com",
      phone: "204-555-0000",
      branchId: 1,
    });
    expect(error).toBeUndefined();
  });

  it("create schema → missing required fails", () => {
    const { error } = employeeCreateSchema.validate({ name: "Ada" });
    expect(error).toBeDefined();
  });

  it("update schema → partial payload passes", () => {
    const { error } = employeeUpdateSchema.validate({ phone: "204-555-1111" });
    expect(error).toBeUndefined();
  });
});
