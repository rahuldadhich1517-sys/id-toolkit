import { randomBytes } from "node:crypto";

const CROCKFORD_BASE32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

const CROCKFORD_INDEX: Record<string, number> = {};
for (let i = 0; i < CROCKFORD_BASE32.length; i++) {
  CROCKFORD_INDEX[CROCKFORD_BASE32[i]] = i;
}

const ULID_REGEX = /^[0-7][0123456789ABCDEFGHJKMNPQRSTVWXYZ]{25}$/i;

const MAX_TIMESTAMP = 281474976710655; // 2^48 - 1 (year 10889 AD)

/**
 * Check whether a value is a valid ULID string.
 */
export function isULID(value: unknown): value is string {
  if (typeof value !== "string") {
    return false;
  }
  return ULID_REGEX.test(value);
}

/**
 * Generate a sortable 26-character ULID (Universally Unique Lexicographically
 * Sortable Identifier) using Crockford's Base32.
 *
 * @param timestamp Optional timestamp (Date or milliseconds since epoch). Defaults to Date.now().
 */
export function generateULID(timestamp?: number | Date): string {
  const time = resolveTimestamp(timestamp);

  // Encode 48-bit timestamp into 10 Crockford Base32 characters
  let timeVal = BigInt(time);
  const timeChars: string[] = new Array(10);
  for (let i = 9; i >= 0; i--) {
    timeChars[i] = CROCKFORD_BASE32[Number(timeVal & 0x1fn)];
    timeVal >>= 5n;
  }

  // Encode 80 bits of cryptographically secure randomness into 16 Crockford Base32 characters
  const randBytes = randomBytes(10);
  let randVal = 0n;
  for (let i = 0; i < 10; i++) {
    randVal = (randVal << 8n) | BigInt(randBytes[i]);
  }

  const randChars: string[] = new Array(16);
  for (let i = 15; i >= 0; i--) {
    randChars[i] = CROCKFORD_BASE32[Number(randVal & 0x1fn)];
    randVal >>= 5n;
  }

  return timeChars.join("") + randChars.join("");
}

/**
 * Generate multiple ULIDs.
 */
export function generateULIDs(count: number): string[] {
  validateCount(count);

  return Array.from({ length: count }, () => generateULID());
}

/**
 * Decode the generation timestamp from a ULID string.
 *
 * @returns The timestamp as a Date object.
 */
export function decodeULIDTimestamp(ulid: string): Date {
  if (typeof ulid !== "string") {
    throw new TypeError("ulid must be a string");
  }

  if (!isULID(ulid)) {
    throw new RangeError("Invalid ULID format");
  }

  let time = 0;
  for (let i = 0; i < 10; i++) {
    const char = ulid[i].toUpperCase();
    const val = CROCKFORD_INDEX[char];
    time = time * 32 + val;
  }

  return new Date(time);
}

function resolveTimestamp(timestamp?: number | Date): number {
  if (timestamp === undefined) {
    return Date.now();
  }

  if (timestamp instanceof Date) {
    const time = timestamp.getTime();
    if (Number.isNaN(time)) {
      throw new RangeError("Invalid Date provided for timestamp");
    }
    if (time < 0 || time > MAX_TIMESTAMP) {
      throw new RangeError(
        `timestamp must be between 0 and ${MAX_TIMESTAMP}`
      );
    }
    return time;
  }

  if (typeof timestamp !== "number" || !Number.isInteger(timestamp)) {
    throw new TypeError("timestamp must be an integer or Date");
  }

  if (timestamp < 0 || timestamp > MAX_TIMESTAMP) {
    throw new RangeError(
      `timestamp must be between 0 and ${MAX_TIMESTAMP}`
    );
  }

  return timestamp;
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
