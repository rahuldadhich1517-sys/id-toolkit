export type UUIDVersion = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Check whether a value is a valid UUID.
 *
 * Optionally validates a specific UUID version.
 */
export function isUUID(
  value: unknown,
  version?: UUIDVersion
): value is string {
  if (typeof value !== "string") {
    return false;
  }

  if (!UUID_REGEX.test(value)) {
    return false;
  }

  if (version !== undefined) {
    return getUUIDVersion(value) === version;
  }

  return true;
}

/**
 * Get the UUID version.
 *
 * Returns null when the value is not a valid UUID.
 */
export function getUUIDVersion(
  value: unknown
): UUIDVersion | null {
  if (!isUUID(value)) {
    return null;
  }

  return Number(value[14]) as UUIDVersion;
}