import { describe, expect, it } from "vitest";
import {
  generateNanoId,
  generateNanoIds,
} from "../src/nanoid/index.js";

describe("generateNanoId", () => {
  it("generates default length of 21", () => {
    const id = generateNanoId();

    expect(id).toHaveLength(21);
  });

  it("generates the requested length", () => {
    const id = generateNanoId({ length: 32 });

    expect(id).toHaveLength(32);
  });

  it("uses the default URL-friendly alphabet", () => {
    const id = generateNanoId({ length: 100 });

    expect(id).toMatch(/^[A-Za-z0-9_-]+$/);
  });

  it("supports a custom alphabet", () => {
    const id = generateNanoId({
      length: 50,
      alphabet: "0123456789abcdef",
    });

    expect(id).toMatch(/^[0-9a-f]+$/);
  });

  it("generates unique identifiers", () => {
    const ids = generateNanoIds(1000);

    expect(new Set(ids).size).toBe(1000);
  });

  it("rejects non-integer length", () => {
    expect(() => generateNanoId({ length: 15.5 })).toThrow(
      "length must be an integer"
    );
  });

  it("rejects zero length", () => {
    expect(() => generateNanoId({ length: 0 })).toThrow(
      "length must be greater than 0"
    );
  });

  it("rejects negative length", () => {
    expect(() => generateNanoId({ length: -1 })).toThrow(
      "length must be greater than 0"
    );
  });

  it("rejects excessive length", () => {
    expect(() => generateNanoId({ length: 257 })).toThrow(
      "length cannot exceed 256"
    );
  });

  it("rejects non-string alphabet", () => {
    expect(() =>
      generateNanoId({ alphabet: 123 as never })
    ).toThrow("alphabet must be a string");
  });

  it("rejects alphabet with fewer than two characters", () => {
    expect(() =>
      generateNanoId({ alphabet: "A" })
    ).toThrow("alphabet must contain at least 2 characters");
  });

  it("rejects duplicate alphabet characters", () => {
    expect(() =>
      generateNanoId({ alphabet: "AABC" })
    ).toThrow("alphabet must contain unique characters");
  });

  it("rejects alphabet exceeding 256 characters", () => {
    const alphabet = Array.from(
      { length: 257 },
      (_, index) => String.fromCodePoint(0x100 + index)
    ).join("");

    expect(() =>
      generateNanoId({ alphabet })
    ).toThrow("alphabet cannot contain more than 256 characters");
  });
});

describe("generateNanoIds", () => {
  it("generates requested number of IDs", () => {
    const ids = generateNanoIds(25, { length: 16 });

    expect(ids).toHaveLength(25);
    for (const id of ids) {
      expect(id).toHaveLength(16);
    }
  });

  it("rejects non-integer count", () => {
    expect(() => generateNanoIds(2.5)).toThrow("count must be an integer");
  });

  it("rejects zero count", () => {
    expect(() => generateNanoIds(0)).toThrow("count must be greater than 0");
  });

  it("rejects negative count", () => {
    expect(() => generateNanoIds(-1)).toThrow("count must be greater than 0");
  });

  it("rejects excessive count", () => {
    expect(() => generateNanoIds(1_000_001)).toThrow(
      "count cannot exceed 1,000,000"
    );
  });
});
