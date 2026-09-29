import { describe, expect, it } from "vitest";
import {
  generateUsername,
  generateUsernames,
} from "../src/username-generate/index.js";

describe("generateUsername", () => {
  it("generates a username by default without keywords", () => {
    const username = generateUsername();

    expect(typeof username).toBe("string");
    expect(username.length).toBeGreaterThan(2);
    expect(username).toMatch(/^[a-z]+$/);
  });

  it("combines provided keywords", () => {
    const username = generateUsername({
      keywords: ["rahul", "dev"],
      style: "lowercase",
    });

    expect(username).toMatch(/^(rahuldev|devrahul)$/);
  });

  it("normalizes keywords by stripping special characters and whitespace", () => {
    const username = generateUsername({
      keywords: [" rahul ", "@dev#!"],
      style: "lowercase",
    });

    expect(username).toMatch(/^(rahuldev|devrahul)$/);
  });

  it("handles a single keyword by pairing with an adjective or noun", () => {
    const username = generateUsername({
      keywords: ["alex"],
      style: "lowercase",
    });

    expect(username.toLowerCase()).toContain("alex");
    expect(username.length).toBeGreaterThan(4);
  });

  it("supports camelCase style", () => {
    const username = generateUsername({
      keywords: ["cloud", "pilot"],
      style: "camel",
    });

    expect(username).toMatch(/^[a-z]+[A-Z][a-z]+$/);
  });

  it("supports snake_case style", () => {
    const username = generateUsername({
      keywords: ["cyber", "wolf"],
      style: "snake",
    });

    expect(username).toMatch(/^[a-z]+_[a-z]+$/);
  });

  it("supports kebab-case style", () => {
    const username = generateUsername({
      keywords: ["swift", "coder"],
      style: "kebab",
    });

    expect(username).toMatch(/^[a-z]+-[a-z]+$/);
  });

  it("supports mixed/PascalCase style", () => {
    const username = generateUsername({
      keywords: ["super", "hero"],
      style: "mixed",
    });

    expect(username).toMatch(/^[A-Z][a-z]+[A-Z][a-z]+$/);
  });

  it("supports custom separator", () => {
    const username = generateUsername({
      keywords: ["alpha", "beta"],
      separator: ".",
    });

    expect(username).toContain(".");
  });

  it("appends numbers when includeNumbers is true", () => {
    const username = generateUsername({
      keywords: ["test", "user"],
      includeNumbers: true,
      numberLength: 3,
    });

    expect(username).toMatch(/\d{3}$/);
  });

  it("enforces maxLength", () => {
    const username = generateUsername({
      keywords: ["superlongwordone", "superlongwordtwo"],
      maxLength: 10,
    });

    expect(username.length).toBeLessThanOrEqual(10);
  });

  it("rejects non-array keywords", () => {
    expect(() =>
      generateUsername({ keywords: "invalid" as never })
    ).toThrow("keywords must be an array of strings");
  });

  it("rejects non-string array elements in keywords", () => {
    expect(() =>
      generateUsername({ keywords: [123] as never })
    ).toThrow("keywords must be an array of strings");
  });

  it("rejects invalid style", () => {
    expect(() =>
      generateUsername({ style: "fancy" as never })
    ).toThrow(/style must be one of/);
  });

  it("rejects non-boolean includeNumbers", () => {
    expect(() =>
      generateUsername({ includeNumbers: "yes" as never })
    ).toThrow("includeNumbers must be a boolean");
  });

  it("rejects invalid numberLength", () => {
    expect(() => generateUsername({ numberLength: 0 })).toThrow(
      "numberLength must be greater than 0"
    );
    expect(() => generateUsername({ numberLength: 11 })).toThrow(
      "numberLength cannot exceed 10"
    );
  });

  it("rejects invalid maxLength", () => {
    expect(() => generateUsername({ maxLength: 0 })).toThrow(
      "maxLength must be greater than 0"
    );
  });
});

describe("generateUsernames", () => {
  it("generates the requested number of usernames", () => {
    const usernames = generateUsernames(10, {
      keywords: ["dev", "coder"],
    });

    expect(usernames).toHaveLength(10);
    for (const u of usernames) {
      expect(typeof u).toBe("string");
      expect(u.length).toBeGreaterThan(0);
    }
  });

  it("generates varied usernames across multiple calls", () => {
    const usernames = generateUsernames(30);
    const unique = new Set(usernames);

    expect(unique.size).toBeGreaterThan(15);
  });

  it("rejects non-integer count", () => {
    expect(() => generateUsernames(2.5)).toThrow("count must be an integer");
  });

  it("rejects zero count", () => {
    expect(() => generateUsernames(0)).toThrow("count must be greater than 0");
  });

  it("rejects negative count", () => {
    expect(() => generateUsernames(-1)).toThrow("count must be greater than 0");
  });

  it("rejects count exceeding 1,000,000", () => {
    expect(() => generateUsernames(1_000_001)).toThrow(
      "count cannot exceed 1,000,000"
    );
  });
});
