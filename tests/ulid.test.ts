import { describe, expect, it } from "vitest";
import {
  generateULID,
  generateULIDs,
  decodeULIDTimestamp,
  isULID,
} from "../src/ulid/index.js";

const CROCKFORD_REGEX = /^[0-7][0123456789ABCDEFGHJKMNPQRSTVWXYZ]{25}$/;

describe("generateULID", () => {
  it("generates a 26-character canonical Crockford Base32 string", () => {
    const ulid = generateULID();

    expect(ulid).toHaveLength(26);
    expect(ulid).toMatch(CROCKFORD_REGEX);
  });

  it("encodes the current timestamp close to Date.now()", () => {
    const before = Date.now();
    const ulid = generateULID();
    const after = Date.now();

    const decoded = decodeULIDTimestamp(ulid);
    expect(decoded).toBeInstanceOf(Date);
    expect(decoded.getTime()).toBeGreaterThanOrEqual(before);
    expect(decoded.getTime()).toBeLessThanOrEqual(after);
  });

  it("supports a custom timestamp as number", () => {
    const customTime = 1700000000000;
    const ulid = generateULID(customTime);

    const decoded = decodeULIDTimestamp(ulid);
    expect(decoded.getTime()).toBe(customTime);
  });

  it("supports a custom timestamp as Date", () => {
    const customDate = new Date("2025-01-15T12:00:00.000Z");
    const ulid = generateULID(customDate);

    const decoded = decodeULIDTimestamp(ulid);
    expect(decoded.getTime()).toBe(customDate.getTime());
  });

  it("generates lexicographically sortable identifiers across different times", () => {
    const t1 = 1600000000000;
    const t2 = 1700000000000;
    const t3 = 1800000000000;

    const ulid1 = generateULID(t1);
    const ulid2 = generateULID(t2);
    const ulid3 = generateULID(t3);

    expect(ulid1 < ulid2).toBe(true);
    expect(ulid2 < ulid3).toBe(true);
  });

  it("generates unique ULIDs in bulk", () => {
    const ulids = generateULIDs(1000);

    expect(new Set(ulids).size).toBe(1000);
  });

  it("rejects negative timestamp", () => {
    expect(() => generateULID(-1)).toThrow("timestamp must be between 0");
  });

  it("rejects timestamp exceeding maximum limit", () => {
    expect(() => generateULID(281474976710656)).toThrow(
      "timestamp must be between 0"
    );
  });

  it("rejects invalid Date object", () => {
    expect(() => generateULID(new Date("invalid"))).toThrow(
      "Invalid Date provided for timestamp"
    );
  });

  it("rejects non-integer timestamp number", () => {
    expect(() => generateULID(1700000000000.5)).toThrow(
      "timestamp must be an integer or Date"
    );
  });
});

describe("isULID", () => {
  it("returns true for valid ULIDs", () => {
    const ulid = generateULID();
    expect(isULID(ulid)).toBe(true);
    expect(isULID("01ARZ3NDEKTSV4RRFFQ69G5FAV")).toBe(true);
  });

  it("accepts lowercase valid ULIDs", () => {
    expect(isULID("01arz3ndektsv4rrffq69g5fav")).toBe(true);
  });

  it("returns false for invalid characters like I, L, O, U", () => {
    expect(isULID("01ARZ3NDEKTSV4RRFFQ69G5FAI")).toBe(false);
    expect(isULID("01ARZ3NDEKTSV4RRFFQ69G5FAL")).toBe(false);
    expect(isULID("01ARZ3NDEKTSV4RRFFQ69G5FAO")).toBe(false);
    expect(isULID("01ARZ3NDEKTSV4RRFFQ69G5FAU")).toBe(false);
  });

  it("returns false for invalid length", () => {
    expect(isULID("01ARZ3NDEK")).toBe(false);
    expect(isULID("01ARZ3NDEKTSV4RRFFQ69G5FAVXX")).toBe(false);
  });

  it("returns false for non-string values", () => {
    expect(isULID(null)).toBe(false);
    expect(isULID(undefined)).toBe(false);
    expect(isULID(12345)).toBe(false);
    expect(isULID({})).toBe(false);
  });

  it("returns false when first character exceeds 7", () => {
    expect(isULID("81ARZ3NDEKTSV4RRFFQ69G5FAV")).toBe(false);
    expect(isULID("Z1ARZ3NDEKTSV4RRFFQ69G5FAV")).toBe(false);
  });
});

describe("decodeULIDTimestamp", () => {
  it("correctly decodes official spec test vector timestamp", () => {
    const date = decodeULIDTimestamp("01ARZ3NDEKTSV4RRFFQ69G5FAV");
    expect(date.getTime()).toBe(1469922850259);
  });

  it("rejects non-string input", () => {
    expect(() => decodeULIDTimestamp(123 as never)).toThrow(
      "ulid must be a string"
    );
  });

  it("rejects invalid ULID format", () => {
    expect(() => decodeULIDTimestamp("invalid-ulid")).toThrow(
      "Invalid ULID format"
    );
  });
});

describe("generateULIDs", () => {
  it("generates the requested number of ULIDs", () => {
    const ulids = generateULIDs(20);

    expect(ulids).toHaveLength(20);
    for (const u of ulids) {
      expect(isULID(u)).toBe(true);
    }
  });

  it("rejects non-integer count", () => {
    expect(() => generateULIDs(3.5)).toThrow("count must be an integer");
  });

  it("rejects zero count", () => {
    expect(() => generateULIDs(0)).toThrow("count must be greater than 0");
  });

  it("rejects negative count", () => {
    expect(() => generateULIDs(-1)).toThrow("count must be greater than 0");
  });

  it("rejects count exceeding 1,000,000", () => {
    expect(() => generateULIDs(1_000_001)).toThrow(
      "count cannot exceed 1,000,000"
    );
  });
});
