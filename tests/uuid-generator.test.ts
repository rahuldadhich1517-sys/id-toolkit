import { describe, expect, it } from "vitest";
import {
  uuidV4,
  uuidV7,
  generateUUIDs,
} from "../src/uuid-generator/index.js";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

describe("uuidV4", () => {
  it("generates a valid UUID", () => {
    const uuid = uuidV4();

    expect(uuid).toMatch(UUID_REGEX);
  });

  it("generates UUID version 4", () => {
    const uuid = uuidV4();

    expect(uuid[14]).toBe("4");
  });

  it("generates the RFC variant", () => {
    const uuid = uuidV4();

    expect(["8", "9", "a", "b"]).toContain(
      uuid[19].toLowerCase()
    );
  });

  it("generates unique UUIDs", () => {
    const ids = new Set(
      Array.from({ length: 1000 }, () => uuidV4())
    );

    expect(ids.size).toBe(1000);
  });
});

describe("uuidV7", () => {
  it("generates a valid UUID", () => {
    const uuid = uuidV7();

    expect(uuid).toMatch(UUID_REGEX);
  });

  it("generates UUID version 7", () => {
    const uuid = uuidV7();

    expect(uuid[14]).toBe("7");
  });

  it("generates the RFC variant", () => {
    const uuid = uuidV7();

    expect(["8", "9", "a", "b"]).toContain(
      uuid[19].toLowerCase()
    );
  });

  it("uses the current timestamp", () => {
    const before = Date.now();

    const uuid = uuidV7();

    const after = Date.now();

    const timestampHex = uuid.replace(/-/g, "").slice(0, 12);
    const timestamp = Number.parseInt(timestampHex, 16);

    expect(timestamp).toBeGreaterThanOrEqual(before);
    expect(timestamp).toBeLessThanOrEqual(after);
  });
});

describe("generateUUIDs", () => {
  it("generates the requested number of UUID v4 values", () => {
    const ids = generateUUIDs(10, "v4");

    expect(ids).toHaveLength(10);
    expect(ids.every(id => id[14] === "4")).toBe(true);
  });

  it("generates the requested number of UUID v7 values", () => {
    const ids = generateUUIDs(10, "v7");

    expect(ids).toHaveLength(10);
    expect(ids.every(id => id[14] === "7")).toBe(true);
  });

  it("generates unique values", () => {
    const ids = generateUUIDs(1000);

    expect(new Set(ids).size).toBe(1000);
  });

  it("rejects non-integer counts", () => {
    expect(() =>
      generateUUIDs(2.5)
    ).toThrow("count must be an integer");
  });

  it("rejects zero", () => {
    expect(() =>
      generateUUIDs(0)
    ).toThrow("count must be greater than 0");
  });

  it("rejects negative counts", () => {
    expect(() =>
      generateUUIDs(-1)
    ).toThrow("count must be greater than 0");
  });

  it("rejects counts above the limit", () => {
    expect(() =>
      generateUUIDs(1_000_001)
    ).toThrow("count cannot exceed 1,000,000");
  });
});