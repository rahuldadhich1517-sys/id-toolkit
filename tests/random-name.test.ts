import { describe, expect, it } from "vitest";
import {
  generateRandomName,
  generateRandomNames,
} from "../src/random-name/index.js";
import { LOCALES_DATA } from "../src/random-name/data/names.js";

describe("generateRandomName", () => {
  it("generates a person name object with firstName, lastName, and fullName", () => {
    const person = generateRandomName();

    expect(typeof person.firstName).toBe("string");
    expect(typeof person.lastName).toBe("string");
    expect(typeof person.fullName).toBe("string");
    expect(person.fullName).toBe(`${person.firstName} ${person.lastName}`);
  });

  it("selects names from the default English dataset", () => {
    const person = generateRandomName({ locale: "en" });

    const allFirstNames = [
      ...LOCALES_DATA.en.maleFirstNames,
      ...LOCALES_DATA.en.femaleFirstNames,
      ...LOCALES_DATA.en.neutralFirstNames,
    ];

    expect(allFirstNames).toContain(person.firstName);
    expect(LOCALES_DATA.en.lastNames).toContain(person.lastName);
  });

  it("supports male gender filter", () => {
    const person = generateRandomName({ gender: "male" });

    expect(LOCALES_DATA.en.maleFirstNames).toContain(person.firstName);
  });

  it("supports female gender filter", () => {
    const person = generateRandomName({ gender: "female" });

    expect(LOCALES_DATA.en.femaleFirstNames).toContain(person.firstName);
  });

  it("supports neutral gender filter", () => {
    const person = generateRandomName({ gender: "neutral" });

    expect(LOCALES_DATA.en.neutralFirstNames).toContain(person.firstName);
  });

  it("supports 'all' gender option", () => {
    const person = generateRandomName({ gender: "all" });

    expect(person.fullName).toBeDefined();
  });

  it("rejects invalid locale", () => {
    expect(() =>
      generateRandomName({ locale: "fr" as never })
    ).toThrow(/locale must be one of/);
  });

  it("rejects invalid gender", () => {
    expect(() =>
      generateRandomName({ gender: "other" as never })
    ).toThrow(/gender must be one of/);
  });

  it("rejects invalid options type", () => {
    expect(() =>
      generateRandomName(123 as never)
    ).toThrow("options must be an object");
  });
});

describe("generateRandomNames", () => {
  it("generates the requested number of person names", () => {
    const people = generateRandomNames(10, { gender: "female" });

    expect(people).toHaveLength(10);
    for (const p of people) {
      expect(p.fullName).toBe(`${p.firstName} ${p.lastName}`);
    }
  });

  it("generates varied names across multiple calls", () => {
    const people = generateRandomNames(50);
    const uniqueFullNames = new Set(people.map(p => p.fullName));

    expect(uniqueFullNames.size).toBeGreaterThan(25);
  });

  it("rejects non-integer count", () => {
    expect(() => generateRandomNames(2.5)).toThrow("count must be an integer");
  });

  it("rejects zero count", () => {
    expect(() => generateRandomNames(0)).toThrow("count must be greater than 0");
  });

  it("rejects negative count", () => {
    expect(() => generateRandomNames(-1)).toThrow("count must be greater than 0");
  });

  it("rejects excessive count", () => {
    expect(() => generateRandomNames(1_000_001)).toThrow(
      "count cannot exceed 1,000,000"
    );
  });
});
