import { describe, expect, it } from "vitest";
import {
  generateShortId,
  generateShortIds,
} from "../src/short-id/index.js";

describe("generateShortId", () => {
  it("generates the default length", () => {
    const id = generateShortId();

    expect(id).toHaveLength(12);
  });

  it("generates the requested length", () => {
    const id = generateShortId({
      length: 20,
    });

    expect(id).toHaveLength(20);
  });

  it("uses the default URL-friendly alphabet", () => {
    const id = generateShortId({
      length: 100,
    });

    expect(id).toMatch(
      /^[0-9A-Za-z]+$/
    );
  });

  it("supports a custom alphabet", () => {
    const id = generateShortId({
      length: 50,
      alphabet: "ABC123",
    });

    expect(id).toMatch(
      /^[ABC123]+$/
    );
  });

  it("supports a numeric-only alphabet", () => {
    const id = generateShortId({
      length: 20,
      alphabet: "0123456789",
    });

    expect(id).toMatch(
      /^[0-9]+$/
    );
  });

  it("generates unique identifiers", () => {
    const ids = generateShortIds(1000);

    expect(new Set(ids).size).toBe(1000);
  });

  it("rejects non-integer length", () => {
    expect(() =>
      generateShortId({
        length: 5.5,
      })
    ).toThrow("length must be an integer");
  });

  it("rejects zero length", () => {
    expect(() =>
      generateShortId({
        length: 0,
      })
    ).toThrow("length must be greater than 0");
  });

  it("rejects excessive length", () => {
    expect(() =>
      generateShortId({
        length: 257,
      })
    ).toThrow("length cannot exceed 256");
  });

  it("rejects an alphabet with fewer than two characters", () => {
    expect(() =>
      generateShortId({
        alphabet: "A",
      })
    ).toThrow(
      "alphabet must contain at least 2 characters"
    );
  });

  it("rejects duplicate alphabet characters", () => {
    expect(() =>
      generateShortId({
        alphabet: "AABC",
      })
    ).toThrow(
      "alphabet must contain unique characters"
    );
  });

  it("rejects an alphabet larger than 256 characters", () => {
    const alphabet = Array.from(
      { length: 257 },
      (_, index) => String.fromCodePoint(0x100 + index)
    ).join("");

    expect(() =>
      generateShortId({ alphabet })
    ).toThrow(
      "alphabet cannot contain more than 256 characters"
    );
  });

  it("rejects invalid count", () => {
    expect(() =>
      generateShortIds(0)
    ).toThrow("count must be greater than 0");
  });

  it("rejects non-integer count", () => {
    expect(() =>
      generateShortIds(2.5)
    ).toThrow("count must be an integer");
  });

  it("generates the requested number of IDs", () => {
    const ids = generateShortIds(25);

    expect(ids).toHaveLength(25);
  });
});