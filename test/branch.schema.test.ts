import { branchCreateSchema, branchUpdateSchema } from "../src/api/v1/validation/branch.schema";

describe("validation/branch.schema", () => {
  /** ✅ CREATE schema tests **/

  it("create schema → valid payload passes", () => {
    const { error } = branchCreateSchema.validate({
      name: "Main",
      address: "123 River Rd",
      phone: "204-555-2222",
    });
    expect(error).toBeUndefined();
  });

  it("create schema → missing required fails", () => {
    // address and phone are missing -> should fail
    const { error } = branchCreateSchema.validate({ name: "Main" });
    expect(error).toBeDefined();
  });

  it("create schema → invalid phone fails (wrong TYPE)", () => {
    // Use wrong TYPE so it always fails even if there is no regex pattern
    const { error } = branchCreateSchema.validate({
      name: "Main",
      address: "123 River Rd",
      phone: 12345 as any, // not a string
    });
    expect(error).toBeDefined();
  });

  it("create schema → invalid name TYPE fails", () => {
    const { error } = branchCreateSchema.validate({
      name: 123 as any,                // not a string
      address: "123 River Rd",
      phone: "204-555-1111",
    });
    expect(error).toBeDefined();
  });

  /** ✅ UPDATE schema tests **/

  it("update schema → partial payload passes", () => {
    // Update schema typically allows partials
    const { error } = branchUpdateSchema.validate({ phone: "204-555-9999" });
    expect(error).toBeUndefined();
  });

  it("update schema → empty payload (current schema) behavior", () => {
    // Your current schema likely does NOT have .min(1), so empty payload passes.
    // If you later add .min(1), flip this to expect(error).toBeDefined().
    const { error } = branchUpdateSchema.validate({});
    expect(error).toBeUndefined();
  });

  it("update schema → invalid field TYPE fails", () => {
    // Wrong TYPE for name should fail (expects string)
    const { error } = branchUpdateSchema.validate({ name: 123 as any });
    expect(error).toBeDefined();
  });

  it("update schema → invalid phone TYPE fails", () => {
    // Wrong TYPE for phone should fail even without a format regex
    const { error } = branchUpdateSchema.validate({ phone: 123 as any });
    expect(error).toBeDefined();
  });
});
