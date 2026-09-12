import { describe, expect, it } from "vitest";
import {
  isUUID,
  getUUIDVersion,
} from "../src/uuid-validator/index.js";

describe("isUUID", () => {
  it("accepts a valid UUID v4", () => {
    expect(
      isUUID("550e8400-e29b-41d4-a716-446655440000")
    ).toBe(true);
  });

  it("accepts a valid UUID v7", () => {
    expect(
      isUUID("01990c4e-7a12-7abc-8def-123456789abc")
    ).toBe(true);
  });

  it("accepts uppercase UUIDs", () => {
    expect(
      isUUID("550E8400-E29B-41D4-A716-446655440000")
    ).toBe(true);
  });

  it("accepts UUID v4 when version 4 is requested", () => {
    expect(
      isUUID(
        "550e8400-e29b-41d4-a716-446655440000",
        4
      )
    ).toBe(true);
  });

  it("rejects UUID v4 when version 7 is requested", () => {
    expect(
      isUUID(
        "550e8400-e29b-41d4-a716-446655440000",
        7
      )
    ).toBe(false);
  });

  it("rejects malformed UUIDs", () => {
    expect(isUUID("not-a-uuid")).toBe(false);
  });

  it("rejects UUIDs without hyphens", () => {
    expect(
      isUUID("550e8400e29b41d4a716446655440000")
    ).toBe(false);
  });

  it("rejects UUIDs with incorrect length", () => {
    expect(
      isUUID("550e8400-e29b-41d4-a716")
    ).toBe(false);
  });

  it("rejects invalid version", () => {
    expect(
      isUUID("550e8400-e29b-91d4-a716-446655440000")
    ).toBe(false);
  });

  it("rejects invalid variant", () => {
    expect(
      isUUID("550e8400-e29b-41d4-0116-446655440000")
    ).toBe(false);
  });

  it("rejects non-string values", () => {
    expect(isUUID(null)).toBe(false);
    expect(isUUID(undefined)).toBe(false);
    expect(isUUID(123)).toBe(false);
    expect(isUUID({})).toBe(false);
  });

  it("rejects empty strings", () => {
    expect(isUUID("")).toBe(false);
  });
});

describe("getUUIDVersion", () => {
  it("returns version 4", () => {
    expect(
      getUUIDVersion(
        "550e8400-e29b-41d4-a716-446655440000"
      )
    ).toBe(4);
  });

  it("returns version 7", () => {
    expect(
      getUUIDVersion(
        "01990c4e-7a12-7abc-8def-123456789abc"
      )
    ).toBe(7);
  });

  it("returns null for invalid UUID", () => {
    expect(
      getUUIDVersion("not-a-uuid")
    ).toBeNull();
  });

  it("returns null for non-string values", () => {
    expect(getUUIDVersion(null)).toBeNull();
    expect(getUUIDVersion(123)).toBeNull();
  });
});