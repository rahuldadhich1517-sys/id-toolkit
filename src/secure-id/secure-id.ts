import { randomBytes } from "node:crypto";

export type SecureIdEncoding = "hex" | "base64url";

export interface SecureIdOptions {
  bytes?: number;
  encoding?: SecureIdEncoding;
}

/**
 * Generate a cryptographically secure identifier.
 *
 * @param options Configuration for byte length and encoding.
 */
export function generateSecureId(
  options: SecureIdOptions = {}
): string {
  const bytes = options.bytes ?? 32;
  const encoding = options.encoding ?? "hex";

  validateBytes(bytes);
  validateEncoding(encoding);

  return randomBytes(bytes).toString(encoding);
}

/**
 * Generate multiple cryptographically secure identifiers.
 */
export function generateSecureIds(
  count: number,
  options: SecureIdOptions = {}
): string[] {
  validateCount(count);

  return Array.from(
    { length: count },
    () => generateSecureId(options)
  );
}

function validateBytes(bytes: number): void {
  if (!Number.isInteger(bytes)) {
    throw new TypeError("bytes must be an integer");
  }

  if (bytes < 1) {
    throw new RangeError(
      "bytes must be greater than 0"
    );
  }

  if (bytes > 1024) {
    throw new RangeError(
      "bytes cannot exceed 1024"
    );
  }
}

function validateCount(count: number): void {
  if (!Number.isInteger(count)) {
    throw new TypeError("count must be an integer");
  }

  if (count < 1) {
    throw new RangeError(
      "count must be greater than 0"
    );
  }

  if (count > 1_000_000) {
    throw new RangeError(
      "count cannot exceed 1,000,000"
    );
  }
}

function validateEncoding(
  encoding: SecureIdEncoding
): void {
  if (
    encoding !== "hex" &&
    encoding !== "base64url"
  ) {
    throw new RangeError(
      'encoding must be either "hex" or "base64url"'
    );
  }
}