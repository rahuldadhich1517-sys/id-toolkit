import { randomBytes } from "node:crypto";

export type UUIDVersion = "v4" | "v7";

/**
 * Generate a UUID v4 using cryptographically secure random bytes.
 */
export function uuidV4(): string {
  const bytes = randomBytes(16);

  // RFC 9562 / UUID version 4
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  return bytesToUUID(bytes);
}

/**
 * Generate a UUID v7 using the current Unix timestamp.
 *
 * UUID v7 is time-ordered and useful for sortable identifiers,
 * database keys, event IDs, and distributed systems.
 */
export function uuidV7(): string {
  const bytes = randomBytes(16);

  const timestamp = BigInt(Date.now());

  // 48-bit Unix timestamp in milliseconds.
  bytes[0] = Number((timestamp >> 40n) & 0xffn);
  bytes[1] = Number((timestamp >> 32n) & 0xffn);
  bytes[2] = Number((timestamp >> 24n) & 0xffn);
  bytes[3] = Number((timestamp >> 16n) & 0xffn);
  bytes[4] = Number((timestamp >> 8n) & 0xffn);
  bytes[5] = Number(timestamp & 0xffn);

  // Version 7.
  bytes[6] = (bytes[6] & 0x0f) | 0x70;

  // RFC variant.
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  return bytesToUUID(bytes);
}

/**
 * Generate multiple UUIDs.
 */
export function generateUUIDs(
  count: number,
  version: UUIDVersion = "v4"
): string[] {
  validateCount(count);

  const generator = version === "v7" ? uuidV7 : uuidV4;

  return Array.from({ length: count }, generator);
}

function bytesToUUID(bytes: Uint8Array): string {
  if (bytes.length !== 16) {
    throw new RangeError("UUID requires exactly 16 bytes");
  }

  const hex = Array.from(bytes, byte =>
    byte.toString(16).padStart(2, "0")
  ).join("");

  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20, 32),
  ].join("-");
}

function validateCount(count: number): void {
  if (!Number.isInteger(count)) {
    throw new TypeError("count must be an integer");
  }

  if (count < 1) {
    throw new RangeError("count must be greater than 0");
  }

  if (count > 1_000_000) {
    throw new RangeError("count cannot exceed 1,000,000");
  }
}