import { randomBytes, randomInt } from "node:crypto";

export type RandomNumberMode = "integer" | "decimal";

export interface RandomNumberOptions {
  min?: number;
  max?: number;
  mode?: RandomNumberMode;
  precision?: number;
  allowRepeats?: boolean;
}

const DEFAULT_MIN = 0;
const DEFAULT_MAX = 100;
const DEFAULT_MODE: RandomNumberMode = "integer";

/**
 * Generate a cryptographically secure uniform float in [0, 1).
 * Uses 53 bits of random entropy (JavaScript IEEE 754 precision limit).
 */
function cryptoRandomFloat(): number {
  const buffer = randomBytes(7);
  const high =
    ((buffer[0] & 0x1f) * 0x1000000) +
    (buffer[1] << 16) +
    (buffer[2] << 8) +
    buffer[3];
  const low = (buffer[4] << 16) + (buffer[5] << 8) + buffer[6];
  const value = high * 0x1000000 + low;
  return value / 0x20000000000000; // 2^53 = 9007199254740992
}

/**
 * Generate a cryptographically secure random number within [min, max] (inclusive).
 */
export function generateRandomNumber(
  options: RandomNumberOptions = {}
): number {
  validateOptions(options);

  const min = options.min ?? DEFAULT_MIN;
  const max = options.max ?? DEFAULT_MAX;
  const mode = options.mode ?? DEFAULT_MODE;

  if (min === max) {
    return min;
  }

  if (mode === "integer") {
    // node:crypto randomInt(min, max) is [min, max) exclusive of max.
    // To make max inclusive, we pass max + 1.
    return randomInt(min, max + 1);
  }

  // Decimal mode
  const raw = min + cryptoRandomFloat() * (max - min);
  if (options.precision !== undefined) {
    return Number(raw.toFixed(options.precision));
  }

  return raw;
}

/**
 * Generate multiple cryptographically secure random numbers.
 * Supports unique values across the requested range when allowRepeats is false.
 */
export function generateRandomNumbers(
  count: number,
  options: RandomNumberOptions = {}
): number[] {
  validateCount(count);
  validateOptions(options);

  const min = options.min ?? DEFAULT_MIN;
  const max = options.max ?? DEFAULT_MAX;
  const mode = options.mode ?? DEFAULT_MODE;
  const allowRepeats = options.allowRepeats ?? true;

  if (allowRepeats) {
    return Array.from({ length: count }, () => generateRandomNumber(options));
  }

  // allowRepeats = false
  if (mode === "integer") {
    const totalAvailable = max - min + 1;
    if (count > totalAvailable) {
      throw new RangeError(
        "count exceeds the number of available unique values in the specified range"
      );
    }

    // When count is equal to available or range is small, full array shuffle is optimal
    if (totalAvailable <= 100_000 && count > totalAvailable / 2) {
      const pool: number[] = Array.from(
        { length: totalAvailable },
        (_, i) => min + i
      );

      // Fisher-Yates partial shuffle
      for (let i = 0; i < count; i++) {
        const j = randomInt(i, totalAvailable);
        const temp = pool[i];
        pool[i] = pool[j];
        pool[j] = temp;
      }

      return pool.slice(0, count);
    }

    // Sparse selection using Set
    const unique = new Set<number>();
    while (unique.size < count) {
      unique.add(generateRandomNumber(options));
    }
    return Array.from(unique);
  }

  // Decimal mode unique generation
  const unique = new Set<number>();
  let attempts = 0;
  const maxAttempts = count * 100;
  while (unique.size < count) {
    attempts++;
    if (attempts > maxAttempts) {
      throw new RangeError(
        "Unable to generate the requested number of unique decimal values with the current precision and range"
      );
    }
    unique.add(generateRandomNumber(options));
  }
  return Array.from(unique);
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

function validateOptions(options: RandomNumberOptions): void {
  if (typeof options !== "object" || options === null) {
    throw new TypeError("options must be an object");
  }

  const { min, max, mode, precision, allowRepeats } = options;

  if (min !== undefined && (!Number.isFinite(min) || typeof min !== "number")) {
    throw new TypeError("min must be a finite number");
  }

  if (max !== undefined && (!Number.isFinite(max) || typeof max !== "number")) {
    throw new TypeError("max must be a finite number");
  }

  const resolvedMin = min ?? DEFAULT_MIN;
  const resolvedMax = max ?? DEFAULT_MAX;
  const resolvedMode = mode ?? DEFAULT_MODE;

  if (resolvedMin > resolvedMax) {
    throw new RangeError("min cannot be greater than max");
  }

  if (mode !== undefined && mode !== "integer" && mode !== "decimal") {
    throw new RangeError('mode must be either "integer" or "decimal"');
  }

  if (resolvedMode === "integer") {
    if (!Number.isInteger(resolvedMin)) {
      throw new TypeError("min must be an integer in integer mode");
    }
    if (!Number.isInteger(resolvedMax)) {
      throw new TypeError("max must be an integer in integer mode");
    }
  }

  if (precision !== undefined) {
    if (!Number.isInteger(precision)) {
      throw new TypeError("precision must be an integer");
    }
    if (precision < 0 || precision > 15) {
      throw new RangeError("precision must be between 0 and 15");
    }
  }

  if (allowRepeats !== undefined && typeof allowRepeats !== "boolean") {
    throw new TypeError("allowRepeats must be a boolean");
  }
}
