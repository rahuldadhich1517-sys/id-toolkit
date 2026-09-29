import { describe, expect, it } from "vitest";
import {
  generateRandomNumber,
  generateRandomNumbers,
} from "../src/random-number/index.js";

describe("generateRandomNumber", () => {
  it("generates an integer in default range [0, 100]", () => {
    for (let i = 0; i < 50; i++) {
      const num = generateRandomNumber();
      expect(Number.isInteger(num)).toBe(true);
      expect(num).toBeGreaterThanOrEqual(0);
      expect(num).toBeLessThanOrEqual(100);
    }
  });

  it("respects custom min and max", () => {
    for (let i = 0; i < 50; i++) {
      const num = generateRandomNumber({ min: 10, max: 20 });
      expect(num).toBeGreaterThanOrEqual(10);
      expect(num).toBeLessThanOrEqual(20);
    }
  });

  it("handles negative ranges", () => {
    for (let i = 0; i < 50; i++) {
      const num = generateRandomNumber({ min: -50, max: -20 });
      expect(num).toBeGreaterThanOrEqual(-50);
      expect(num).toBeLessThanOrEqual(-20);
    }
  });

  it("handles ranges crossing zero", () => {
    for (let i = 0; i < 50; i++) {
      const num = generateRandomNumber({ min: -5, max: 5 });
      expect(num).toBeGreaterThanOrEqual(-5);
      expect(num).toBeLessThanOrEqual(5);
    }
  });

  it("handles min equal to max", () => {
    expect(generateRandomNumber({ min: 42, max: 42 })).toBe(42);
    expect(generateRandomNumber({ min: 0, max: 0 })).toBe(0);
  });

  it("supports decimal mode", () => {
    const num = generateRandomNumber({
      min: 1,
      max: 5,
      mode: "decimal",
    });

    expect(num).toBeGreaterThanOrEqual(1);
    expect(num).toBeLessThanOrEqual(5);
  });

  it("supports decimal mode with precision", () => {
    for (let i = 0; i < 20; i++) {
      const num = generateRandomNumber({
        min: 0,
        max: 1,
        mode: "decimal",
        precision: 2,
      });

      const decimalPlaces = num.toString().split(".")[1]?.length ?? 0;
      expect(decimalPlaces).toBeLessThanOrEqual(2);
    }
  });

  it("rejects min > max", () => {
    expect(() =>
      generateRandomNumber({ min: 100, max: 50 })
    ).toThrow("min cannot be greater than max");
  });

  it("rejects non-integer bounds in integer mode", () => {
    expect(() =>
      generateRandomNumber({ min: 1.5, max: 10 })
    ).toThrow("min must be an integer in integer mode");

    expect(() =>
      generateRandomNumber({ min: 1, max: 10.5 })
    ).toThrow("max must be an integer in integer mode");
  });

  it("rejects invalid mode", () => {
    expect(() =>
      generateRandomNumber({ mode: "binary" as never })
    ).toThrow(/mode must be either "integer" or "decimal"/);
  });

  it("rejects invalid precision", () => {
    expect(() =>
      generateRandomNumber({ mode: "decimal", precision: -1 })
    ).toThrow("precision must be between 0 and 15");

    expect(() =>
      generateRandomNumber({ mode: "decimal", precision: 20 })
    ).toThrow("precision must be between 0 and 15");
  });
});

describe("generateRandomNumbers", () => {
  it("generates the requested count of random numbers", () => {
    const numbers = generateRandomNumbers(20, { min: 1, max: 100 });

    expect(numbers).toHaveLength(20);
    for (const num of numbers) {
      expect(num).toBeGreaterThanOrEqual(1);
      expect(num).toBeLessThanOrEqual(100);
    }
  });

  it("generates unique numbers when allowRepeats is false", () => {
    const numbers = generateRandomNumbers(10, {
      min: 1,
      max: 100,
      allowRepeats: false,
    });

    expect(numbers).toHaveLength(10);
    expect(new Set(numbers).size).toBe(10);
  });

  it("generates all numbers in range when count equals available and allowRepeats is false", () => {
    const numbers = generateRandomNumbers(10, {
      min: 1,
      max: 10,
      allowRepeats: false,
    });

    expect(numbers).toHaveLength(10);
    expect(new Set(numbers).size).toBe(10);
    for (let i = 1; i <= 10; i++) {
      expect(numbers).toContain(i);
    }
  });

  it("rejects when count exceeds available values and allowRepeats is false", () => {
    expect(() =>
      generateRandomNumbers(11, {
        min: 1,
        max: 10,
        allowRepeats: false,
      })
    ).toThrow(
      "count exceeds the number of available unique values in the specified range"
    );
  });

  it("rejects non-integer count", () => {
    expect(() => generateRandomNumbers(2.5)).toThrow("count must be an integer");
  });

  it("rejects zero count", () => {
    expect(() => generateRandomNumbers(0)).toThrow("count must be greater than 0");
  });

  it("rejects negative count", () => {
    expect(() => generateRandomNumbers(-1)).toThrow("count must be greater than 0");
  });

  it("rejects count exceeding maximum limit", () => {
    expect(() => generateRandomNumbers(1_000_001)).toThrow(
      "count cannot exceed 1,000,000"
    );
  });
});
