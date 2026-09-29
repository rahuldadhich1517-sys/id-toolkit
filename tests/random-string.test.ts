import { describe, expect, it } from "vitest";
import {
  generateRandomString,
  generateRandomStrings,
  BUILTIN_CHARSETS,
} from "../src/random-string/index.js";

describe("generateRandomString", () => {
  it("generates a string with default length 16 and alphanumeric charset", () => {
    const str = generateRandomString();

    expect(str).toHaveLength(16);
    expect(str).toMatch(/^[0-9A-Za-z]+$/);
  });

  it("generates the requested length", () => {
    const str = generateRandomString({ length: 32 });

    expect(str).toHaveLength(32);
  });

  it("supports lowercase preset", () => {
    const str = generateRandomString({ length: 50, charset: "lowercase" });

    expect(str).toMatch(/^[a-z]+$/);
  });

  it("supports uppercase preset", () => {
    const str = generateRandomString({ length: 50, charset: "uppercase" });

    expect(str).toMatch(/^[A-Z]+$/);
  });

  it("supports numeric preset", () => {
    const str = generateRandomString({ length: 50, charset: "numeric" });

    expect(str).toMatch(/^[0-9]+$/);
  });

  it("supports alpha preset", () => {
    const str = generateRandomString({ length: 50, charset: "alpha" });

    expect(str).toMatch(/^[A-Za-z]+$/);
  });

  it("supports symbols preset", () => {
    const str = generateRandomString({ length: 50, charset: "symbols" });

    for (const char of str) {
      expect(BUILTIN_CHARSETS.symbols).toContain(char);
    }
  });

  it("supports hex preset", () => {
    const str = generateRandomString({ length: 50, charset: "hex" });

    expect(str).toMatch(/^[0-9a-f]+$/);
  });

  it("supports custom character sets", () => {
    const str = generateRandomString({
      length: 40,
      charset: "ABCDEF0123456789",
    });

    expect(str).toMatch(/^[0-9A-F]+$/);
  });

  it("generates unique strings across iterations", () => {
    const strings = generateRandomStrings(1000);

    expect(new Set(strings).size).toBe(1000);
  });

  it("rejects non-integer length", () => {
    expect(() => generateRandomString({ length: 12.5 })).toThrow(
      "length must be an integer"
    );
  });

  it("rejects zero length", () => {
    expect(() => generateRandomString({ length: 0 })).toThrow(
      "length must be greater than 0"
    );
  });

  it("rejects negative length", () => {
    expect(() => generateRandomString({ length: -10 })).toThrow(
      "length must be greater than 0"
    );
  });

  it("rejects length exceeding 65,536", () => {
    expect(() => generateRandomString({ length: 65_537 })).toThrow(
      "length cannot exceed 65,536"
    );
  });

  it("rejects non-string charset", () => {
    expect(() =>
      generateRandomString({ charset: 123 as never })
    ).toThrow("charset must be a string");
  });

  it("rejects charset with fewer than two characters", () => {
    expect(() => generateRandomString({ charset: "x" })).toThrow(
      "charset must contain at least 2 characters"
    );
  });

  it("rejects duplicate characters in custom charset", () => {
    expect(() => generateRandomString({ charset: "abca" })).toThrow(
      "charset must contain unique characters"
    );
  });

  it("rejects charset with more than 256 characters", () => {
    const charset = Array.from(
      { length: 257 },
      (_, index) => String.fromCodePoint(0x100 + index)
    ).join("");

    expect(() => generateRandomString({ charset })).toThrow(
      "charset cannot contain more than 256 characters"
    );
  });
});

describe("generateRandomStrings", () => {
  it("generates the requested number of random strings", () => {
    const strings = generateRandomStrings(15, { length: 20 });

    expect(strings).toHaveLength(15);
    for (const s of strings) {
      expect(s).toHaveLength(20);
    }
  });

  it("rejects non-integer count", () => {
    expect(() => generateRandomStrings(3.5)).toThrow(
      "count must be an integer"
    );
  });

  it("rejects zero count", () => {
    expect(() => generateRandomStrings(0)).toThrow(
      "count must be greater than 0"
    );
  });

  it("rejects negative count", () => {
    expect(() => generateRandomStrings(-1)).toThrow(
      "count must be greater than 0"
    );
  });

  it("rejects count exceeding 1,000,000", () => {
    expect(() => generateRandomStrings(1_000_001)).toThrow(
      "count cannot exceed 1,000,000"
    );
  });
});
