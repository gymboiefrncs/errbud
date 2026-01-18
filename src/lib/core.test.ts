import { normalizeError } from "./core.js";
import { describe, expect, it, vi } from "vitest";

describe("normalizeError", () => {
  it("should extract basic error information", () => {
    const error = new Error("Error occured");
    error.name = "CustomError";

    const result = normalizeError(error);

    expect(result.name).toBe("CustomError");
    expect(result.message).toBe("Error occured");
    expect(result.timestamp).toBeDefined();
    expect(result.raw).toBe(error);
  });

  it("should handle non error", () => {
    const result = normalizeError("Something went wrong");
    expect(result.name).toBe("Error");
    expect(result.message).toBe("An unexpected error occured");
    expect(result.stack).toBeUndefined();
  });

  it("should correctly parses stack frames with parenthesis", () => {
    const mockError = new Error("Fail");
    mockError.stack = `Error: Fail
    at Object.<anonymous> (C:\\project\\src\\index.ts:10:5)
    at Module._compile (node:internal/modules/cjs/loader:1101:14)`;
    vi.spyOn(process, "cwd").mockReturnValue("C:\\project");

    const result = normalizeError(mockError);

    expect(result.stack).toContainEqual({
      fn: "Object.<anonymous>",
      file: "src\\index.ts",
      line: 10,
      column: 5,
    });
  });

  it("should correctly parses stack frames without parenthesis", () => {
    const mockError = new Error("Fail");
    mockError.stack = `Error: Fail
    at Object.<anonymous> C:\\project\\src\\index.ts:10:5
    at Module._compile (node:internal/modules/cjs/loader:1101:14)`;
    vi.spyOn(process, "cwd").mockReturnValue("C:\\project");

    const result = normalizeError(mockError);

    expect(result.stack).toContainEqual({
      fn: "Object.<anonymous>",
      file: "src\\index.ts",
      line: 10,
      column: 5,
    });
  });
});
