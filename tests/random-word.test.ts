import { describe, expect, it } from "vitest";
import {
  generateRandomWord,
  generateRandomWords,
} from "../src/random-word/index.js";
import { WORD_DATA } from "../src/random-word/data/words.js";

describe("generateRandomWord", () => {
  it("generates a random word by default", () => {
    const word = generateRandomWord();

    expect(typeof word).toBe("string");
    expect(word.length).toBeGreaterThan(0);
  });

  it("filters by minLength", () => {
    for (let i = 0; i < 20; i++) {
      const word = generateRandomWord({ minLength: 6 });
      expect(word.length).toBeGreaterThanOrEqual(6);
    }
  });

  it("filters by maxLength", () => {
    for (let i = 0; i < 20; i++) {
      const word = generateRandomWord({ maxLength: 5 });
      expect(word.length).toBeLessThanOrEqual(5);
    }
  });

  it("filters by minLength and maxLength", () => {
    for (let i = 0; i < 20; i++) {
      const word = generateRandomWord({ minLength: 4, maxLength: 6 });
      expect(word.length).toBeGreaterThanOrEqual(4);
      expect(word.length).toBeLessThanOrEqual(6);
    }
  });

  it("filters by exactLength", () => {
    for (let i = 0; i < 20; i++) {
      const word = generateRandomWord({ exactLength: 5 });
      expect(word).toHaveLength(5);
    }
  });

  it("filters by noun part of speech", () => {
    for (let i = 0; i < 20; i++) {
      const word = generateRandomWord({ partOfSpeech: "noun" });
      expect(WORD_DATA.noun).toContain(word);
    }
  });

  it("filters by verb part of speech", () => {
    for (let i = 0; i < 20; i++) {
      const word = generateRandomWord({ partOfSpeech: "verb" });
      expect(WORD_DATA.verb).toContain(word);
    }
  });

  it("filters by adjective part of speech", () => {
    for (let i = 0; i < 20; i++) {
      const word = generateRandomWord({ partOfSpeech: "adjective" });
      expect(WORD_DATA.adjective).toContain(word);
    }
  });

  it("filters by adverb part of speech", () => {
    for (let i = 0; i < 20; i++) {
      const word = generateRandomWord({ partOfSpeech: "adverb" });
      expect(WORD_DATA.adverb).toContain(word);
    }
  });

  it("throws clear RangeError when no words match criteria", () => {
    expect(() =>
      generateRandomWord({ exactLength: 99 })
    ).toThrow("No words found matching the specified criteria");
  });

  it("rejects minLength greater than maxLength", () => {
    expect(() =>
      generateRandomWord({ minLength: 10, maxLength: 5 })
    ).toThrow("minLength cannot be greater than maxLength");
  });

  it("rejects non-integer minLength", () => {
    expect(() => generateRandomWord({ minLength: 3.5 })).toThrow(
      "minLength must be an integer"
    );
  });

  it("rejects non-integer maxLength", () => {
    expect(() => generateRandomWord({ maxLength: 5.5 })).toThrow(
      "maxLength must be an integer"
    );
  });

  it("rejects non-integer exactLength", () => {
    expect(() => generateRandomWord({ exactLength: 4.5 })).toThrow(
      "exactLength must be an integer"
    );
  });

  it("rejects invalid partOfSpeech", () => {
    expect(() =>
      generateRandomWord({ partOfSpeech: "pronoun" as never })
    ).toThrow(/partOfSpeech must be one of/);
  });
});

describe("generateRandomWords", () => {
  it("generates the requested number of random words", () => {
    const words = generateRandomWords(15, { partOfSpeech: "noun" });

    expect(words).toHaveLength(15);
    for (const w of words) {
      expect(WORD_DATA.noun).toContain(w);
    }
  });

  it("generates varied words across multiple calls", () => {
    const words = generateRandomWords(50);
    const unique = new Set(words);

    expect(unique.size).toBeGreaterThan(20);
  });

  it("rejects non-integer count", () => {
    expect(() => generateRandomWords(2.5)).toThrow("count must be an integer");
  });

  it("rejects zero count", () => {
    expect(() => generateRandomWords(0)).toThrow("count must be greater than 0");
  });

  it("rejects negative count", () => {
    expect(() => generateRandomWords(-1)).toThrow("count must be greater than 0");
  });

  it("rejects count exceeding 1,000,000", () => {
    expect(() => generateRandomWords(1_000_001)).toThrow(
      "count cannot exceed 1,000,000"
    );
  });
});
