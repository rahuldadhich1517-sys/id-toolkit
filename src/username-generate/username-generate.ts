import { randomInt } from "node:crypto";
import { USERNAME_ADJECTIVES, USERNAME_NOUNS } from "./data/words.js";

export type UsernameStyle =
  | "lowercase"
  | "camel"
  | "snake"
  | "kebab"
  | "mixed";

export interface UsernameOptions {
  keywords?: string[];
  separator?: string;
  includeNumbers?: boolean;
  numberLength?: number;
  style?: UsernameStyle;
  maxLength?: number;
}

const VALID_STYLES: ReadonlySet<string> = new Set([
  "lowercase",
  "camel",
  "snake",
  "kebab",
  "mixed",
]);

function pickRandom<T>(items: readonly T[]): T {
  return items[randomInt(0, items.length)];
}

function normalizeKeyword(kw: string): string {
  return kw.replace(/[^a-zA-Z0-9]/g, "").trim();
}

/**
 * Generate an available-looking username from keywords or curated word components.
 *
 * NOTE: This generator creates candidate usernames only and does NOT perform
 * network calls or claim actual availability on any external service.
 */
export function generateUsername(options: UsernameOptions = {}): string {
  validateOptions(options);

  const style = options.style ?? "lowercase";
  const includeNumbers = options.includeNumbers ?? false;
  const numberLength = options.numberLength ?? 2;

  let parts: string[] = [];

  const rawKeywords = options.keywords ?? [];
  const validKeywords = rawKeywords
    .map(normalizeKeyword)
    .filter(kw => kw.length > 0);

  if (validKeywords.length >= 2) {
    // When 2+ keywords are provided, use them (shuffling randomly)
    parts = [...validKeywords];
    for (let i = parts.length - 1; i > 0; i--) {
      const j = randomInt(0, i + 1);
      const temp = parts[i];
      parts[i] = parts[j];
      parts[j] = temp;
    }
  } else if (validKeywords.length === 1) {
    // 1 keyword provided: combine with an adjective or noun
    const kw = validKeywords[0];
    const coinFlip = randomInt(0, 2);
    if (coinFlip === 0) {
      parts = [pickRandom(USERNAME_ADJECTIVES), kw];
    } else {
      parts = [kw, pickRandom(USERNAME_NOUNS)];
    }
  } else {
    // No valid keywords provided: pick adjective + noun
    parts = [pickRandom(USERNAME_ADJECTIVES), pickRandom(USERNAME_NOUNS)];
  }

  // Resolve default separator based on style
  let sep = options.separator;
  if (sep === undefined) {
    if (style === "snake") {
      sep = "_";
    } else if (style === "kebab") {
      sep = "-";
    } else {
      sep = "";
    }
  }

  // Format parts according to style
  let username: string;
  switch (style) {
    case "lowercase":
      username = parts.map(p => p.toLowerCase()).join(sep);
      break;
    case "camel":
      username = parts
        .map((p, idx) =>
          idx === 0
            ? p.toLowerCase()
            : p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()
        )
        .join(sep);
      break;
    case "snake":
      username = parts.map(p => p.toLowerCase()).join(sep);
      break;
    case "kebab":
      username = parts.map(p => p.toLowerCase()).join(sep);
      break;
    case "mixed":
      username = parts
        .map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
        .join(sep);
      break;
    default:
      username = parts.join(sep);
  }

  // Append numbers if requested
  if (includeNumbers) {
    const digits = Array.from({ length: numberLength }, () =>
      randomInt(0, 10).toString()
    ).join("");
    username = `${username}${digits}`;
  }

  // Apply maxLength limit if specified
  if (options.maxLength !== undefined && username.length > options.maxLength) {
    username = username.slice(0, options.maxLength);
  }

  return username;
}

/**
 * Generate multiple candidate usernames.
 */
export function generateUsernames(
  count: number,
  options: UsernameOptions = {}
): string[] {
  validateCount(count);

  return Array.from({ length: count }, () => generateUsername(options));
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

function validateOptions(options: UsernameOptions): void {
  if (typeof options !== "object" || options === null) {
    throw new TypeError("options must be an object");
  }

  const { keywords, separator, includeNumbers, numberLength, style, maxLength } =
    options;

  if (keywords !== undefined) {
    if (!Array.isArray(keywords)) {
      throw new TypeError("keywords must be an array of strings");
    }
    for (const kw of keywords) {
      if (typeof kw !== "string") {
        throw new TypeError("keywords must be an array of strings");
      }
    }
  }

  if (separator !== undefined && typeof separator !== "string") {
    throw new TypeError("separator must be a string");
  }

  if (includeNumbers !== undefined && typeof includeNumbers !== "boolean") {
    throw new TypeError("includeNumbers must be a boolean");
  }

  if (numberLength !== undefined) {
    if (!Number.isInteger(numberLength)) {
      throw new TypeError("numberLength must be an integer");
    }
    if (numberLength < 1) {
      throw new RangeError("numberLength must be greater than 0");
    }
    if (numberLength > 10) {
      throw new RangeError("numberLength cannot exceed 10");
    }
  }

  if (style !== undefined) {
    if (typeof style !== "string") {
      throw new TypeError("style must be a string");
    }
    if (!VALID_STYLES.has(style)) {
      throw new RangeError(
        `style must be one of: ${Array.from(VALID_STYLES).join(", ")}`
      );
    }
  }

  if (maxLength !== undefined) {
    if (!Number.isInteger(maxLength)) {
      throw new TypeError("maxLength must be an integer");
    }
    if (maxLength < 1) {
      throw new RangeError("maxLength must be greater than 0");
    }
  }
}
