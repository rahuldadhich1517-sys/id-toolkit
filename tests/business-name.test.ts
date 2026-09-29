import { describe, expect, it } from "vitest";
import {
  generateBusinessName,
  generateBusinessNames,
} from "../src/business-name/index.js";

describe("generateBusinessName", () => {
  it("generates a business name with domain hint by default", () => {
    const result = generateBusinessName();

    expect(typeof result.name).toBe("string");
    expect(result.name.length).toBeGreaterThan(1);
    expect(typeof result.domainHint).toBe("string");
    expect(result.domainHint).toMatch(/^[a-z0-9]+\.[a-z]+$/);
  });

  it("omits domain hint when includeDomainHint is false", () => {
    const result = generateBusinessName({ includeDomainHint: false });

    expect(result.name).toBeDefined();
    expect(result.domainHint).toBeUndefined();
  });

  it("supports technology category", () => {
    const result = generateBusinessName({ category: "technology" });

    expect(result.name).toBeDefined();
    expect(result.domainHint).toBeDefined();
  });

  it("supports finance category", () => {
    const result = generateBusinessName({ category: "finance" });

    expect(result.name).toBeDefined();
    expect(result.domainHint).toBeDefined();
  });

  it("supports modern style", () => {
    const result = generateBusinessName({ style: "modern" });

    expect(result.name).toBeDefined();
    expect(result.name).toMatch(/^[A-Z][a-z]+$/);
  });

  it("supports compound style", () => {
    const result = generateBusinessName({ style: "compound" });

    expect(result.name).toBeDefined();
    expect(result.name).toMatch(/^[A-Z][a-z]+[A-Z][a-z]+$/);
  });

  it("supports two-word style", () => {
    const result = generateBusinessName({ style: "two-word" });

    expect(result.name).toBeDefined();
    expect(result.name).toContain(" ");
  });

  it("supports minimal style", () => {
    const result = generateBusinessName({ style: "minimal" });

    expect(result.name).toBeDefined();
    expect(result.name.length).toBeGreaterThanOrEqual(3);
  });

  it("incorporates provided keywords", () => {
    const result = generateBusinessName({
      keywords: ["nexus"],
      style: "modern",
    });

    expect(result.name.toLowerCase()).toContain("nexus");
  });

  it("supports custom suffix and separator", () => {
    const result = generateBusinessName({
      style: "modern",
      suffix: "Ventures",
      separator: " - ",
    });

    expect(result.name).toContain(" - Ventures");
  });

  it("rejects invalid category", () => {
    expect(() =>
      generateBusinessName({ category: "invalid" as never })
    ).toThrow(/category must be one of/);
  });

  it("rejects invalid style", () => {
    expect(() =>
      generateBusinessName({ style: "fancy" as never })
    ).toThrow(/style must be one of/);
  });

  it("rejects invalid keywords type", () => {
    expect(() =>
      generateBusinessName({ keywords: "not-an-array" as never })
    ).toThrow("keywords must be an array of strings");
  });

  it("rejects invalid keywords elements", () => {
    expect(() =>
      generateBusinessName({ keywords: [123] as never })
    ).toThrow("keywords must be an array of strings");
  });

  it("rejects invalid includeDomainHint type", () => {
    expect(() =>
      generateBusinessName({ includeDomainHint: "yes" as never })
    ).toThrow("includeDomainHint must be a boolean");
  });
});

describe("generateBusinessNames", () => {
  it("generates the requested number of business names", () => {
    const results = generateBusinessNames(10, { category: "finance" });

    expect(results).toHaveLength(10);
    for (const item of results) {
      expect(typeof item.name).toBe("string");
      expect(typeof item.domainHint).toBe("string");
    }
  });

  it("generates varied business names in bulk", () => {
    const results = generateBusinessNames(50);
    const names = new Set(results.map(r => r.name));

    expect(names.size).toBeGreaterThan(20);
  });

  it("rejects non-integer count", () => {
    expect(() => generateBusinessNames(2.5)).toThrow("count must be an integer");
  });

  it("rejects zero count", () => {
    expect(() => generateBusinessNames(0)).toThrow("count must be greater than 0");
  });

  it("rejects negative count", () => {
    expect(() => generateBusinessNames(-5)).toThrow("count must be greater than 0");
  });

  it("rejects count exceeding maximum limit", () => {
    expect(() => generateBusinessNames(1_000_001)).toThrow("count cannot exceed 1,000,000");
  });
});
