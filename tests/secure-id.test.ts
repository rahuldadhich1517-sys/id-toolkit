import { describe, expect, it } from "vitest";
import {
  generateSecureId,
  generateSecureIds,
} from "../src/secure-id/index.js";

describe("generateSecureId", () => {
  it("generates a default hex identifier", () => {
    const id = generateSecureId();

    expect(id).toHaveLength(64);
    expect(id).toMatch(/^[0-9a-f]+$/);
  });

  it("generates the requested number of bytes", () => {
    const id = generateSecureId({
      bytes: 16,
    });

    expect(id).toHaveLength(32);
  });

  it("supports base64url encoding", () => {
    const id = generateSecureId({
      bytes: 32,
      encoding: "base64url",
    });

    expect(id).toHaveLength(43);
    expect(id).toMatch(/^[A-Za-z0-9_-]+$/);
  });

  it("generates unique identifiers", () => {
    const ids = generateSecureIds(1000);

    expect(new Set(ids).size).toBe(1000);
  });

  it("supports bulk generation with options", () => {
    const ids = generateSecureIds(10, {
      bytes: 16,
      encoding: "base64url",
    });

    expect(ids).toHaveLength(10);
    expect(
      ids.every(id => /^[A-Za-z0-9_-]+$/.test(id))
    ).toBe(true);
  });

  it("rejects non-integer byte length", () => {
    expect(() =>
      generateSecureId({
        bytes: 10.5,
      })
    ).toThrow("bytes must be an integer");
  });

  it("rejects zero bytes", () => {
    expect(() =>
      generateSecureId({
        bytes: 0,
      })
    ).toThrow(
      "bytes must be greater than 0"
    );
  });

  it("rejects excessive byte length", () => {
    expect(() =>
      generateSecureId({
        bytes: 1025,
      })
    ).toThrow(
      "bytes cannot exceed 1024"
    );
  });

  it("rejects invalid encoding", () => {
    expect(() =>
      generateSecureId({
        encoding: "base32" as never,
      })
    ).toThrow(
      'encoding must be either "hex" or "base64url"'
    );
  });

  it("rejects invalid count", () => {
    expect(() =>
      generateSecureIds(0)
    ).toThrow(
      "count must be greater than 0"
    );
  });

  it("rejects non-integer count", () => {
    expect(() =>
      generateSecureIds(2.5)
    ).toThrow(
      "count must be an integer"
    );
  });

  it("rejects excessive count", () => {
    expect(() =>
      generateSecureIds(1_000_001)
    ).toThrow(
      "count cannot exceed 1,000,000"
    );
  });
});