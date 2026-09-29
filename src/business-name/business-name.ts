import { randomInt } from "node:crypto";
import {
  CATEGORY_WORDS,
  COMPOUND_SUFFIXES,
  DOMAIN_TLDS,
  MINIMAL_NAMES,
  MODERN_SUFFIXES,
  SECOND_WORDS,
} from "./data/components.js";

export type BusinessNameCategory =
  | "technology"
  | "finance"
  | "health"
  | "creative"
  | "retail"
  | "general";

export type BusinessNameStyle =
  | "modern"
  | "compound"
  | "two-word"
  | "minimal";

export interface BusinessNameOptions {
  category?: BusinessNameCategory;
  style?: BusinessNameStyle;
  keywords?: string[];
  suffix?: string;
  separator?: string;
  includeDomainHint?: boolean;
}

export interface BusinessNameResult {
  name: string;
  domainHint?: string;
}

const VALID_CATEGORIES: ReadonlySet<string> = new Set([
  "technology",
  "finance",
  "health",
  "creative",
  "retail",
  "general",
]);

const VALID_STYLES: ReadonlySet<string> = new Set([
  "modern",
  "compound",
  "two-word",
  "minimal",
]);

function pickRandom<T>(items: readonly T[]): T {
  return items[randomInt(0, items.length)];
}

function capitalize(text: string): string {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Generate a brandable business name with an optional domain hint.
 */
export function generateBusinessName(
  options: BusinessNameOptions = {}
): BusinessNameResult {
  validateOptions(options);

  const category = options.category ?? "general";
  const style = options.style ?? pickRandom(["modern", "compound", "two-word"] as const);
  const includeDomainHint = options.includeDomainHint ?? true;

  const wordPool = CATEGORY_WORDS[category] ?? CATEGORY_WORDS.general;

  let baseWord: string;
  if (options.keywords && options.keywords.length > 0) {
    const rawKeyword = pickRandom(options.keywords);
    baseWord = rawKeyword.replace(/[^a-zA-Z]/g, "").toLowerCase() || pickRandom(wordPool);
  } else {
    baseWord = pickRandom(wordPool);
  }

  let name: string;

  switch (style) {
    case "modern": {
      const suffix = pickRandom(MODERN_SUFFIXES);
      // Avoid awkward duplicate letters like cloud + ora = cloudora
      const trimmedBase = baseWord.endsWith(suffix[0]) ? baseWord.slice(0, -1) : baseWord;
      name = capitalize(trimmedBase + suffix);
      break;
    }
    case "compound": {
      const secondPart = pickRandom(COMPOUND_SUFFIXES);
      const sep = options.separator ?? "";
      name = `${capitalize(baseWord)}${sep}${capitalize(secondPart)}`;
      break;
    }
    case "two-word": {
      const secondPart = pickRandom(SECOND_WORDS);
      const sep = options.separator ?? " ";
      name = `${capitalize(baseWord)}${sep}${secondPart}`;
      break;
    }
    case "minimal": {
      name = pickRandom(MINIMAL_NAMES);
      break;
    }
    default: {
      name = capitalize(baseWord);
    }
  }

  if (options.suffix) {
    const sep = options.separator ?? " ";
    name = `${name}${sep}${options.suffix.trim()}`;
  }

  const result: BusinessNameResult = { name };

  if (includeDomainHint) {
    const cleanSlug = name.toLowerCase().replace(/[^a-z0-9]/g, "");
    let tld = ".com";
    if (category === "technology") {
      tld = pickRandom([".com", ".io", ".ai", ".dev"]);
    } else {
      tld = pickRandom(DOMAIN_TLDS);
    }
    result.domainHint = `${cleanSlug}${tld}`;
  }

  return result;
}

/**
 * Generate multiple brandable business names.
 */
export function generateBusinessNames(
  count: number,
  options: BusinessNameOptions = {}
): BusinessNameResult[] {
  validateCount(count);

  return Array.from({ length: count }, () => generateBusinessName(options));
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

function validateOptions(options: BusinessNameOptions): void {
  if (typeof options !== "object" || options === null) {
    throw new TypeError("options must be an object");
  }

  if (options.category !== undefined) {
    if (typeof options.category !== "string") {
      throw new TypeError("category must be a string");
    }
    if (!VALID_CATEGORIES.has(options.category)) {
      throw new RangeError(
        `category must be one of: ${Array.from(VALID_CATEGORIES).join(", ")}`
      );
    }
  }

  if (options.style !== undefined) {
    if (typeof options.style !== "string") {
      throw new TypeError("style must be a string");
    }
    if (!VALID_STYLES.has(options.style)) {
      throw new RangeError(
        `style must be one of: ${Array.from(VALID_STYLES).join(", ")}`
      );
    }
  }

  if (options.keywords !== undefined) {
    if (!Array.isArray(options.keywords)) {
      throw new TypeError("keywords must be an array of strings");
    }
    for (const kw of options.keywords) {
      if (typeof kw !== "string") {
        throw new TypeError("keywords must be an array of strings");
      }
    }
  }

  if (options.suffix !== undefined && typeof options.suffix !== "string") {
    throw new TypeError("suffix must be a string");
  }

  if (options.separator !== undefined && typeof options.separator !== "string") {
    throw new TypeError("separator must be a string");
  }

  if (
    options.includeDomainHint !== undefined &&
    typeof options.includeDomainHint !== "boolean"
  ) {
    throw new TypeError("includeDomainHint must be a boolean");
  }
}
