import { randomInt } from "node:crypto";
import { WORD_DATA } from "./data/words.js";

export type PartOfSpeech = "noun" | "verb" | "adjective" | "adverb" | "any";

export interface RandomWordOptions {
  minLength?: number;
  maxLength?: number;
  exactLength?: number;
  partOfSpeech?: PartOfSpeech;
}

const VALID_PARTS_OF_SPEECH: ReadonlySet<string> = new Set([
  "noun",
  "verb",
  "adjective",
  "adverb",
  "any",
]);

const ALL_WORDS: string[] = Array.from(
  new Set([
    ...WORD_DATA.noun,
    ...WORD_DATA.verb,
    ...WORD_DATA.adjective,
    ...WORD_DATA.adverb,
  ])
);

/**
 * Generate a random word from a local curated dataset with optional
 * length and part-of-speech filtering.
 */
export function generateRandomWord(options: RandomWordOptions = {}): string {
  validateOptions(options);

  const pool = getFilteredWordPool(options);

  if (pool.length === 0) {
    throw new RangeError("No words found matching the specified criteria");
  }

  const index = randomInt(0, pool.length);
  return pool[index];
}

/**
 * Generate multiple random words.
 */
export function generateRandomWords(
  count: number,
  options: RandomWordOptions = {}
): string[] {
  validateCount(count);

  return Array.from({ length: count }, () => generateRandomWord(options));
}

function getFilteredWordPool(options: RandomWordOptions): string[] {
  const { partOfSpeech = "any", minLength, maxLength, exactLength } = options;

  let baseWords: string[];
  if (partOfSpeech === "any") {
    baseWords = ALL_WORDS;
  } else {
    baseWords = WORD_DATA[partOfSpeech];
  }

  return baseWords.filter(word => {
    const len = word.length;
    if (exactLength !== undefined && len !== exactLength) {
      return false;
    }
    if (minLength !== undefined && len < minLength) {
      return false;
    }
    if (maxLength !== undefined && len > maxLength) {
      return false;
    }
    return true;
  });
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

function validateOptions(options: RandomWordOptions): void {
  if (typeof options !== "object" || options === null) {
    throw new TypeError("options must be an object");
  }

  const { minLength, maxLength, exactLength, partOfSpeech } = options;

  if (minLength !== undefined) {
    if (!Number.isInteger(minLength)) {
      throw new TypeError("minLength must be an integer");
    }
    if (minLength < 1) {
      throw new RangeError("minLength must be greater than 0");
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

  if (exactLength !== undefined) {
    if (!Number.isInteger(exactLength)) {
      throw new TypeError("exactLength must be an integer");
    }
    if (exactLength < 1) {
      throw new RangeError("exactLength must be greater than 0");
    }
  }

  if (minLength !== undefined && maxLength !== undefined && minLength > maxLength) {
    throw new RangeError("minLength cannot be greater than maxLength");
  }

  if (exactLength !== undefined) {
    if (minLength !== undefined && exactLength < minLength) {
      throw new RangeError("exactLength cannot be less than minLength");
    }
    if (maxLength !== undefined && exactLength > maxLength) {
      throw new RangeError("exactLength cannot be greater than maxLength");
    }
  }

  if (partOfSpeech !== undefined) {
    if (typeof partOfSpeech !== "string") {
      throw new TypeError("partOfSpeech must be a string");
    }
    if (!VALID_PARTS_OF_SPEECH.has(partOfSpeech)) {
      throw new RangeError(
        `partOfSpeech must be one of: ${Array.from(VALID_PARTS_OF_SPEECH).join(", ")}`
      );
    }
  }
}
