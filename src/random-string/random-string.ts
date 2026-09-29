import { randomBytes } from "node:crypto";

export type BuiltInCharset =
  | "lowercase"
  | "uppercase"
  | "numeric"
  | "alpha"
  | "alphanumeric"
  | "symbols"
  | "hex";

export interface RandomStringOptions {
  length?: number;
  charset?: BuiltInCharset | string;
}

export const BUILTIN_CHARSETS: Record<BuiltInCharset, string> = {
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  numeric: "0123456789",
  alpha: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  alphanumeric:
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
  hex: "0123456789abcdef",
};

const DEFAULT_LENGTH = 16;
const DEFAULT_CHARSET: BuiltInCharset = "alphanumeric";

/**
 * Generate a random string using cryptographically secure random bytes
 * and rejection sampling to prevent modulo bias.
 *
 * Distinct from `secure-id`: `random-string` is for general-purpose random
 * text from a configurable character set, whereas `secure-id` generates
 * raw entropy tokens with explicit byte sizes.
 */
export function generateRandomString(
  options: RandomStringOptions = {}
): string {
  const length = options.length ?? DEFAULT_LENGTH;
  const rawCharset = options.charset ?? DEFAULT_CHARSET;

  validateLength(length);
  const alphabet = resolveCharset(rawCharset);
  validateAlphabet(alphabet);

  const result: string[] = [];
  const limit = Math.floor(256 / alphabet.length) * alphabet.length;

  while (result.length < length) {
    const bytesNeeded = length - result.length;
    const bytesToFetch = Math.max(bytesNeeded, Math.ceil(bytesNeeded * 1.2));
    const bytes = randomBytes(bytesToFetch);

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
 * Generate multiple random strings.
 */
export function generateRandomStrings(
  count: number,
  options: RandomStringOptions = {}
): string[] {
  validateCount(count);

  return Array.from({ length: count }, () => generateRandomString(options));
}

function resolveCharset(charset: BuiltInCharset | string): string {
  if (typeof charset !== "string") {
    throw new TypeError("charset must be a string");
  }

  if (charset in BUILTIN_CHARSETS) {
    return BUILTIN_CHARSETS[charset as BuiltInCharset];
  }

  return charset;
}

function validateLength(length: number): void {
  if (!Number.isInteger(length)) {
    throw new TypeError("length must be an integer");
  }

  if (length < 1) {
    throw new RangeError("length must be greater than 0");
  }

  if (length > 65_536) {
    throw new RangeError("length cannot exceed 65,536");
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
  if (alphabet.length < 2) {
    throw new RangeError("charset must contain at least 2 characters");
  }

  if (alphabet.length > 256) {
    throw new RangeError("charset cannot contain more than 256 characters");
  }

  const uniqueChars = new Set(alphabet);
  if (uniqueChars.size !== alphabet.length) {
    throw new RangeError("charset must contain unique characters");
  }
}
