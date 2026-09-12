import { randomBytes } from "node:crypto";

export interface ShortIdOptions {
  length?: number;
  alphabet?: string;
}

const DEFAULT_ALPHABET =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

const DEFAULT_LENGTH = 12;

/**
 * Generate a compact URL-friendly identifier.
 *
 * Uses cryptographically secure random bytes and rejection
 * sampling to avoid modulo bias.
 */
export function generateShortId(
  options: ShortIdOptions = {}
): string {
  const length = options.length ?? DEFAULT_LENGTH;
  const alphabet = options.alphabet ?? DEFAULT_ALPHABET;

  validateLength(length);
  validateAlphabet(alphabet);

  const result: string[] = [];

  // Largest multiple of alphabet length that fits in one byte.
  // Bytes above this limit are rejected to avoid modulo bias.
  const limit =
    Math.floor(256 / alphabet.length) * alphabet.length;

  while (result.length < length) {
    const bytes = randomBytes(length - result.length);

    for (const byte of bytes) {
      if (byte >= limit) {
        continue;
      }

      result.push(alphabet[byte % alphabet.length]);

      if (result.length === length) {
        break;
      }
    }
  }

  return result.join("");
}

/**
 * Generate multiple compact identifiers.
 */
export function generateShortIds(
  count: number,
  options: ShortIdOptions = {}
): string[] {
  validateCount(count);

  return Array.from(
    { length: count },
    () => generateShortId(options)
  );
}

function validateLength(length: number): void {
  if (!Number.isInteger(length)) {
    throw new TypeError("length must be an integer");
  }

  if (length < 1) {
    throw new RangeError("length must be greater than 0");
  }

  if (length > 256) {
    throw new RangeError("length cannot exceed 256");
  }
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

function validateAlphabet(alphabet: string): void {
  if (typeof alphabet !== "string") {
    throw new TypeError("alphabet must be a string");
  }

  if (alphabet.length < 2) {
    throw new RangeError(
      "alphabet must contain at least 2 characters"
    );
  }

  if (alphabet.length > 256) {
    throw new RangeError(
      "alphabet cannot contain more than 256 characters"
    );
  }

  const uniqueCharacters = new Set(alphabet);

  if (uniqueCharacters.size !== alphabet.length) {
    throw new RangeError(
      "alphabet must contain unique characters"
    );
  }
}