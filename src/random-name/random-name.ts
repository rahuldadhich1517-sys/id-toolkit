import { randomInt } from "node:crypto";
import { LOCALES_DATA } from "./data/names.js";

export type RandomNameLocale = "en";

export type RandomNameGender = "male" | "female" | "neutral" | "all";

export interface RandomNameOptions {
  locale?: RandomNameLocale;
  gender?: RandomNameGender;
}

export interface PersonName {
  firstName: string;
  lastName: string;
  fullName: string;
}

const SUPPORTED_LOCALES: ReadonlySet<string> = new Set(["en"]);
const SUPPORTED_GENDERS: ReadonlySet<string> = new Set([
  "male",
  "female",
  "neutral",
  "all",
]);

function pickRandom<T>(items: readonly T[]): T {
  return items[randomInt(0, items.length)];
}

/**
 * Generate a random person name using local curated datasets.
 */
export function generateRandomName(
  options: RandomNameOptions = {}
): PersonName {
  validateOptions(options);

  const locale = options.locale ?? "en";
  const gender = options.gender ?? "all";

  const localeData = LOCALES_DATA[locale];

  let firstNamePool: string[];
  switch (gender) {
    case "male":
      firstNamePool = localeData.maleFirstNames;
      break;
    case "female":
      firstNamePool = localeData.femaleFirstNames;
      break;
    case "neutral":
      firstNamePool = localeData.neutralFirstNames;
      break;
    case "all":
    default:
      firstNamePool = [
        ...localeData.maleFirstNames,
        ...localeData.femaleFirstNames,
        ...localeData.neutralFirstNames,
      ];
      break;
  }

  const firstName = pickRandom(firstNamePool);
  const lastName = pickRandom(localeData.lastNames);

  return {
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`,
  };
}

/**
 * Generate multiple random person names.
 */
export function generateRandomNames(
  count: number,
  options: RandomNameOptions = {}
): PersonName[] {
  validateCount(count);

  return Array.from({ length: count }, () => generateRandomName(options));
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

function validateOptions(options: RandomNameOptions): void {
  if (typeof options !== "object" || options === null) {
    throw new TypeError("options must be an object");
  }

  if (options.locale !== undefined) {
    if (typeof options.locale !== "string") {
      throw new TypeError("locale must be a string");
    }
    if (!SUPPORTED_LOCALES.has(options.locale)) {
      throw new RangeError(
        `locale must be one of: ${Array.from(SUPPORTED_LOCALES).join(", ")}`
      );
    }
  }

  if (options.gender !== undefined) {
    if (typeof options.gender !== "string") {
      throw new TypeError("gender must be a string");
    }
    if (!SUPPORTED_GENDERS.has(options.gender)) {
      throw new RangeError(
        `gender must be one of: ${Array.from(SUPPORTED_GENDERS).join(", ")}`
      );
    }
  }
}
