# ID Toolkit

A lightweight, dependency-free TypeScript toolkit for generating identifiers, random numbers, strings, words, names, and usernames.

[![npm version](https://img.shields.io/npm/v/@rahul_dadhich15/id-toolkit.svg)](https://www.npmjs.com/package/@rahul_dadhich15/id-toolkit)
[![npm downloads](https://img.shields.io/npm/dm/@rahul_dadhich15/id-toolkit.svg)](https://www.npmjs.com/package/@rahul_dadhich15/id-toolkit)
[![CI](https://github.com/rahuldadhich1517-sys/id-toolkit/actions/workflows/ci.yml/badge.svg)](https://github.com/rahuldadhich1517-sys/id-toolkit/actions/workflows/ci.yml)
[![License](https://img.shields.io/github/license/rahuldadhich1517-sys/id-toolkit)](https://github.com/rahuldadhich1517-sys/id-toolkit)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6.svg)](https://www.typescriptlang.org/)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen.svg)](https://www.npmjs.com/package/@rahul_dadhich15/id-toolkit)

Generate UUIDs, validate UUIDs, create compact short IDs, generate NanoIDs, produce sortable ULIDs, generate cryptographically secure identifiers, brandable business names, random numbers, random strings, words, names, and usernames — all with a simple, type-safe TypeScript API.

---

## Features

- **UUID v4 & v7 generation**: Standards-compliant random and timestamp-ordered UUIDs with bulk support.
- **UUID validation**: Structural and version verification with type guards.
- **Short IDs**: Compact URL-friendly identifiers with configurable length and custom alphabets.
- **Secure IDs**: High-entropy cryptographically secure tokens with Hex and Base64URL encodings.
- **Business Names**: Brandable business name generation with categories, styles, keywords, and suggested domain hints.
- **NanoIDs**: Compact, collision-resistant identifiers using rejection sampling.
- **Random Names**: Person name generation with first, last, and full names by gender and locale.
- **Random Numbers**: Cryptographically secure integer and decimal numbers with range support, precision, and unique sampling.
- **Random Strings**: Configurable random text generation with built-in presets and custom character sets.
- **Random Words**: Curated local dictionary supporting length constraints and parts of speech (noun, verb, adjective, adverb).
- **ULIDs**: Canonical 26-character Crockford Base32 Universally Unique Lexicographically Sortable Identifiers with timestamp decoding.
- **Username Generator**: Clean, available-looking usernames from keywords or curated words with customizable casing styles and numbers.
- **Zero runtime dependencies**: Pure Node.js built-in `crypto` APIs (`randomBytes`, `randomInt`).
- **No Math.random()**: All randomness uses cryptographically secure primitives with zero modulo bias.
- **Offline & Self-contained**: No external network calls, no DNS requests, and no remote dependencies.
- **TypeScript-first**: Full type declarations, strict validation, and intuitive parameter interfaces.
- **Dual module support**: Complete ESM and CommonJS exports.
- **Lightweight**: Optimized package payload under 35 kB.

---

## Installation

```bash
npm install @rahul_dadhich15/id-toolkit
```

---

## Quick Start

### ESM

```ts
import {
  uuidV4,
  uuidV7,
  generateShortId,
  generateNanoId,
  generateULID,
  generateSecureId,
  generateBusinessName,
  generateRandomName,
  generateRandomNumber,
  generateRandomString,
  generateRandomWord,
  generateUsername,
} from "@rahul_dadhich15/id-toolkit";

// Standard & Time-sortable UUIDs
console.log(uuidV4());
// 550e8400-e29b-41d4-a716-446655440000

console.log(uuidV7());
// 0190f7a2-7b3c-7e42-8b91-2a4c7d8e9f10

// Compact IDs
console.log(generateShortId());
// K8x2LmQ9pR7a

console.log(generateNanoId());
// V1StGXR8_Z5jdHi6B-myT

// Sortable ULID
console.log(generateULID());
// 01ARZ3NDEKTSV4RRFFQ69G5FAV

// High-entropy token
console.log(generateSecureId());
// 8f3c9d2e4a7b1c6f0e8d5a3b9c2f7e1d...

// Business names & domains
console.log(generateBusinessName({ category: "technology" }));
// { name: "Cloudora", domainHint: "cloudora.io" }

// Person names
console.log(generateRandomName({ gender: "female" }));
// { firstName: "Sarah", lastName: "Smith", fullName: "Sarah Smith" }

// Crypto-secure random numbers
console.log(generateRandomNumber({ min: 1, max: 100 }));
// 42

// Random strings & words
console.log(generateRandomString({ length: 16, charset: "alphanumeric" }));
// a9B8c7D6e5F4g3H2

console.log(generateRandomWord({ partOfSpeech: "adjective" }));
// luminous

// Usernames
console.log(generateUsername({ keywords: ["rahul", "dev"], style: "camel" }));
// rahulDev
```

### CommonJS

```js
const {
  uuidV4,
  generateNanoId,
  generateULID,
  generateBusinessName,
} = require("@rahul_dadhich15/id-toolkit");
```

---

# 1. UUID Generator

Generate standards-compliant UUID v4 and UUID v7 identifiers.

## UUID v4

UUID v4 is generated from cryptographically secure random bytes:

```ts
import { uuidV4 } from "@rahul_dadhich15/id-toolkit";

const id = uuidV4();
console.log(id);
// 550e8400-e29b-41d4-a716-446655440000
```

## UUID v7

UUID v7 incorporates a 48-bit Unix timestamp component in the most significant bits, making it naturally time-ordered:

```ts
import { uuidV7 } from "@rahul_dadhich15/id-toolkit";

const id = uuidV7();
console.log(id);
// 0190f7a2-7b3c-7e42-8b91-2a4c7d8e9f10
```

## Bulk UUID Generation

Generate multiple UUIDs at once with version selection:

```ts
import { generateUUIDs } from "@rahul_dadhich15/id-toolkit";

const v4List = generateUUIDs(5, "v4");
const v7List = generateUUIDs(5, "v7");
```

---

# 2. UUID Validator

Validate UUID strings and detect their RFC version.

## Validate a UUID

```ts
import { isUUID } from "@rahul_dadhich15/id-toolkit";

isUUID("550e8400-e29b-41d4-a716-446655440000"); // true
isUUID("hello-world"); // false
isUUID(123); // false
```

Optionally verify a specific version:

```ts
isUUID("550e8400-e29b-41d4-a716-446655440000", 4); // true
isUUID("550e8400-e29b-41d4-a716-446655440000", 7); // false
```

## Get UUID Version

```ts
import { getUUIDVersion } from "@rahul_dadhich15/id-toolkit";

getUUIDVersion("550e8400-e29b-41d4-a716-446655440000"); // 4
getUUIDVersion("invalid"); // null
```

---

# 3. Short ID

Generate compact, URL-friendly identifiers with configurable alphabets.

```ts
import { generateShortId, generateShortIds } from "@rahul_dadhich15/id-toolkit";

const id = generateShortId();
// Default: 12 characters, base62 alphabet (0-9A-Za-z)
// Example: K8x2LmQ9pR7a
```

### Options

```ts
// Custom length
const id = generateShortId({ length: 16 });

// Custom alphabet (rejection sampling prevents modulo bias)
const numericId = generateShortId({
  length: 8,
  alphabet: "0123456789",
});

// Bulk generation
const ids = generateShortIds(10, { length: 8 });
```

---

# 4. Secure ID

Generate cryptographically secure identifiers with explicit byte lengths and encodings.

```ts
import { generateSecureId, generateSecureIds } from "@rahul_dadhich15/id-toolkit";

// Default: 32 random bytes, hex encoded (64 characters)
const token = generateSecureId();

// URL-safe Base64URL encoding
const sessionToken = generateSecureId({
  bytes: 32,
  encoding: "base64url",
});

// Bulk generation
const tokens = generateSecureIds(5, { bytes: 16, encoding: "base64url" });
```

---

# 5. Business Name

Generate brandable, creative business names with suggested domain hints from local component datasets.

```ts
import {
  generateBusinessName,
  generateBusinessNames,
} from "@rahul_dadhich15/id-toolkit";

// General business name
const company = generateBusinessName();
// { name: "Apex Labs", domainHint: "apexlabs.com" }

// Technology category
const tech = generateBusinessName({
  category: "technology",
});
// { name: "Cloudora", domainHint: "cloudora.io" }

// Brand with custom keywords
const brand = generateBusinessName({
  keywords: ["nexus", "forge"],
  style: "compound",
});
// { name: "NexusForge", domainHint: "nexusforge.com" }

// Bulk generation
const ideas = generateBusinessNames(10, { category: "finance" });
```

### Options

| Option | Type | Description |
|---|---|---|
| `category` | `"technology" \| "finance" \| "health" \| "creative" \| "retail" \| "general"` | Industry category |
| `style` | `"modern" \| "compound" \| "two-word" \| "minimal"` | Naming style |
| `keywords` | `string[]` | Custom keywords to incorporate |
| `suffix` | `string` | Custom suffix (e.g. `"Technologies"`) |
| `separator` | `string` | Custom separator between parts |
| `includeDomainHint` | `boolean` | Include suggested domain hint (default: `true`) |

> **Note**: Domain hints are suggestions only. No network calls or DNS checks are performed.

---

# 6. NanoID

Generate compact, URL-friendly identifiers following the NanoID specification without any external dependencies.

```ts
import { generateNanoId, generateNanoIds } from "@rahul_dadhich15/id-toolkit";

// Default: 21 characters from `_-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz`
const id = generateNanoId();
// Example: V1StGXR8_Z5jdHi6B-myT

// Custom length and alphabet
const hexId = generateNanoId({
  length: 16,
  alphabet: "0123456789abcdef",
});

// Bulk generation
const batch = generateNanoIds(10, { length: 24 });
```

---

# 7. Random Name

Generate random person names by gender and locale using local datasets.

```ts
import { generateRandomName, generateRandomNames } from "@rahul_dadhich15/id-toolkit";

// Default random name
const person = generateRandomName();
console.log(person.firstName); // "James"
console.log(person.lastName);  // "Smith"
console.log(person.fullName);  // "James Smith"

// Gender-specific
const male = generateRandomName({ gender: "male" });
const female = generateRandomName({ gender: "female" });
const neutral = generateRandomName({ gender: "neutral" });

// Bulk generation
const team = generateRandomNames(10, { gender: "female" });
```

### Options

| Option | Type | Description |
|---|---|---|
| `gender` | `"male" \| "female" \| "neutral" \| "all"` | Gender filter (default: `"all"`) |
| `locale` | `"en"` | Locale dataset (default: `"en"`) |

---

# 8. Random Number

Generate cryptographically secure random numbers with integer and decimal modes, inclusive ranges, and duplicate prevention.

```ts
import {
  generateRandomNumber,
  generateRandomNumbers,
} from "@rahul_dadhich15/id-toolkit";

// Integer in [0, 100] (both min and max inclusive)
const num = generateRandomNumber({ min: 1, max: 100 });

// Negative ranges
const temp = generateRandomNumber({ min: -50, max: 20 });

// Decimal mode with precision
const rating = generateRandomNumber({
  min: 1.0,
  max: 5.0,
  mode: "decimal",
  precision: 2,
});

// Bulk unique numbers without repeats
const lotto = generateRandomNumbers(6, {
  min: 1,
  max: 49,
  allowRepeats: false,
});
```

### Options

| Option | Type | Description |
|---|---|---|
| `min` | `number` | Minimum value inclusive (default: `0`) |
| `max` | `number` | Maximum value inclusive (default: `100`) |
| `mode` | `"integer" \| "decimal"` | Number generation mode (default: `"integer"`) |
| `precision` | `number` | Number of decimal places in decimal mode (0-15) |
| `allowRepeats` | `boolean` | Allow duplicate numbers in bulk calls (default: `true`) |

---

# 9. Random String

Generate random strings from preset or custom character sets using unbiased cryptographic rejection sampling.

```ts
import {
  generateRandomString,
  generateRandomStrings,
} from "@rahul_dadhich15/id-toolkit";

// Default: 16 alphanumeric characters
const str = generateRandomString();

// Built-in presets
const alpha = generateRandomString({ length: 20, charset: "alpha" });
const numeric = generateRandomString({ length: 6, charset: "numeric" });
const symbols = generateRandomString({ length: 12, charset: "symbols" });
const hex = generateRandomString({ length: 32, charset: "hex" });

// Custom character set
const custom = generateRandomString({
  length: 10,
  charset: "ABCDEF0123456789",
});

// Bulk generation
const codes = generateRandomStrings(5, { length: 8, charset: "uppercase" });
```

### Built-in Character Sets

- `"lowercase"`: `a-z`
- `"uppercase"`: `A-Z`
- `"numeric"`: `0-9`
- `"alpha"`: `A-Za-z`
- `"alphanumeric"`: `0-9A-Za-z`
- `"symbols"`: `!@#$%^&*()_+-=[]{}|;:,.<>?`
- `"hex"`: `0-9a-f`

---

# 10. Random Word

Generate random words from a bundled local dictionary with length and part-of-speech filtering.

```ts
import { generateRandomWord, generateRandomWords } from "@rahul_dadhich15/id-toolkit";

// Random word
const word = generateRandomWord();

// By part of speech
const noun = generateRandomWord({ partOfSpeech: "noun" });
const verb = generateRandomWord({ partOfSpeech: "verb" });
const adj = generateRandomWord({ partOfSpeech: "adjective" });
const adv = generateRandomWord({ partOfSpeech: "adverb" });

// By length constraints
const shortWord = generateRandomWord({ minLength: 4, maxLength: 6 });
const exactWord = generateRandomWord({ exactLength: 7 });

// Bulk generation
const passphrase = generateRandomWords(4, { partOfSpeech: "noun" });
```

---

# 11. ULID

Universally Unique Lexicographically Sortable Identifier implementation in canonical Crockford Base32.

- **26 characters**: 10 characters timestamp (48 bits) + 16 characters randomness (80 bits).
- **Time-sortable**: Identifiers naturally sort by creation time.
- **Timestamp decoding**: Extract the creation timestamp as a JavaScript `Date`.

```ts
import {
  generateULID,
  generateULIDs,
  decodeULIDTimestamp,
  isULID,
} from "@rahul_dadhich15/id-toolkit";

// Generate ULID
const ulid = generateULID();
// 01ARZ3NDEKTSV4RRFFQ69G5FAV

// Validate
isULID(ulid); // true

// Decode creation timestamp
const timestamp = decodeULIDTimestamp(ulid);
console.log(timestamp.toISOString());

// Custom timestamp
const historical = generateULID(new Date("2024-01-01T00:00:00Z"));

// Bulk generation
const list = generateULIDs(10);
```

---

# 12. Username Generator

Generate available-looking, clean usernames from keywords or bundled word lists with normalization and casing styles.

```ts
import { generateUsername, generateUsernames } from "@rahul_dadhich15/id-toolkit";

// From keywords
const user1 = generateUsername({ keywords: ["rahul", "dev"] });
// rahuldev

// Casing styles
const camelUser = generateUsername({
  keywords: ["cloud", "pilot"],
  style: "camel",
});
// cloudPilot

const snakeUser = generateUsername({
  keywords: ["cyber", "wolf"],
  style: "snake",
});
// cyber_wolf

const kebabUser = generateUsername({
  keywords: ["swift", "coder"],
  style: "kebab",
});
// swift-coder

// Append numbers
const numbered = generateUsername({
  keywords: ["alex"],
  includeNumbers: true,
  numberLength: 3,
});
// alexsmith482

// Bulk generation
const suggestions = generateUsernames(5, { keywords: ["tech"] });
```

### Options

| Option | Type | Description |
|---|---|---|
| `keywords` | `string[]` | Words to combine and normalize |
| `separator` | `string` | Custom delimiter (e.g. `"."`, `"-"`, `""`) |
| `style` | `"lowercase" \| "camel" \| "snake" \| "kebab" \| "mixed"` | Casing style |
| `includeNumbers` | `boolean` | Append random digits (default: `false`) |
| `numberLength` | `number` | Number of digits to append (1-10, default: `2`) |
| `maxLength` | `number` | Maximum allowed length of username |

---

# API Reference

### UUID & Identifiers

| Function | Return Type | Description |
|---|---|---|
| `uuidV4()` | `string` | Generate standard RFC 9562 UUID v4 |
| `uuidV7()` | `string` | Generate time-ordered RFC 9562 UUID v7 |
| `generateUUIDs(count, version?)` | `string[]` | Generate multiple UUIDs |
| `isUUID(value, version?)` | `boolean` | Validate UUID structure and version |
| `getUUIDVersion(value)` | `number \| null` | Detect UUID version (1-8) |
| `generateShortId(options?)` | `string` | Generate URL-safe compact ID |
| `generateShortIds(count, options?)` | `string[]` | Generate multiple short IDs |
| `generateNanoId(options?)` | `string` | Generate NanoID identifier |
| `generateNanoIds(count, options?)` | `string[]` | Generate multiple NanoIDs |
| `generateULID(timestamp?)` | `string` | Generate 26-char sortable ULID |
| `generateULIDs(count)` | `string[]` | Generate multiple ULIDs |
| `decodeULIDTimestamp(ulid)` | `Date` | Decode ULID timestamp to Date |
| `isULID(value)` | `boolean` | Validate ULID format |
| `generateSecureId(options?)` | `string` | Generate cryptographically secure token |
| `generateSecureIds(count, options?)` | `string[]` | Generate multiple secure tokens |

### Content & Data Generation

| Function | Return Type | Description |
|---|---|---|
| `generateBusinessName(options?)` | `BusinessNameResult` | Generate brandable business name and domain hint |
| `generateBusinessNames(count, options?)` | `BusinessNameResult[]` | Generate multiple business names |
| `generateRandomName(options?)` | `PersonName` | Generate person name object |
| `generateRandomNames(count, options?)` | `PersonName[]` | Generate multiple person names |
| `generateRandomNumber(options?)` | `number` | Generate secure random number in range |
| `generateRandomNumbers(count, options?)` | `number[]` | Generate multiple random numbers |
| `generateRandomString(options?)` | `string` | Generate random text from character set |
| `generateRandomStrings(count, options?)` | `string[]` | Generate multiple random strings |
| `generateRandomWord(options?)` | `string` | Generate word by length and part of speech |
| `generateRandomWords(count, options?)` | `string[]` | Generate multiple words |
| `generateUsername(options?)` | `string` | Generate candidate username |
| `generateUsernames(count, options?)` | `string[]` | Generate multiple usernames |

---

# TypeScript Types

```ts
// UUID
type UUIDGeneratorVersion = "v4" | "v7";
type UUIDValidatorVersion = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

// Short ID & NanoID
interface ShortIdOptions {
  length?: number;
  alphabet?: string;
}

interface NanoIdOptions {
  length?: number;
  alphabet?: string;
}

// Secure ID
type SecureIdEncoding = "hex" | "base64url";
interface SecureIdOptions {
  bytes?: number;
  encoding?: SecureIdEncoding;
}

// Business Name
type BusinessNameCategory = "technology" | "finance" | "health" | "creative" | "retail" | "general";
type BusinessNameStyle = "modern" | "compound" | "two-word" | "minimal";
interface BusinessNameOptions {
  category?: BusinessNameCategory;
  style?: BusinessNameStyle;
  keywords?: string[];
  suffix?: string;
  separator?: string;
  includeDomainHint?: boolean;
}
interface BusinessNameResult {
  name: string;
  domainHint?: string;
}

// Random Name
type RandomNameLocale = "en";
type RandomNameGender = "male" | "female" | "neutral" | "all";
interface RandomNameOptions {
  locale?: RandomNameLocale;
  gender?: RandomNameGender;
}
interface PersonName {
  firstName: string;
  lastName: string;
  fullName: string;
}

// Random Number
type RandomNumberMode = "integer" | "decimal";
interface RandomNumberOptions {
  min?: number;
  max?: number;
  mode?: RandomNumberMode;
  precision?: number;
  allowRepeats?: boolean;
}

// Random String
type BuiltInCharset = "lowercase" | "uppercase" | "numeric" | "alpha" | "alphanumeric" | "symbols" | "hex";
interface RandomStringOptions {
  length?: number;
  charset?: BuiltInCharset | string;
}

// Random Word
type PartOfSpeech = "noun" | "verb" | "adjective" | "adverb" | "any";
interface RandomWordOptions {
  minLength?: number;
  maxLength?: number;
  exactLength?: number;
  partOfSpeech?: PartOfSpeech;
}

// Username Generator
type UsernameStyle = "lowercase" | "camel" | "snake" | "kebab" | "mixed";
interface UsernameOptions {
  keywords?: string[];
  separator?: string;
  includeNumbers?: boolean;
  numberLength?: number;
  style?: UsernameStyle;
  maxLength?: number;
}
```

---

# Identifier Selection Guide

| Identifier | Length | Alphabet | Sortable | Primary Use Case |
|---|---|---|---|---|
| **UUID v4** | 36 chars | Hex + hyphens | No | Standard distributed database keys, entity IDs |
| **UUID v7** | 36 chars | Hex + hyphens | Yes | Time-ordered database primary keys, event logs |
| **Short ID** | Configurable (default 12) | Configurable (default Base62) | No | Short URLs, tracking codes, user-facing IDs |
| **NanoID** | Configurable (default 21) | Configurable (default URL-safe 64) | No | Collision-resistant resource identifiers |
| **ULID** | 26 chars | Crockford Base32 | Yes | Ordered distributed IDs, query pagination |
| **Secure ID** | Configurable bytes | Hex or Base64URL | No | Auth tokens, CSRF tokens, session secrets, API keys |
| **Random String** | Configurable | Any charset | No | Mock data, verification codes, test fixtures |

### Comparing Identifier Utilities

- **`secure-id`**: Intended for security-critical contexts (tokens, secrets). Directly encodes cryptographically random byte buffers into Hex or Base64URL strings.
- **`nanoid`**: Compact, URL-friendly identifiers with collision resistance and rejection sampling.
- **`short-id`**: Flexible compact identifiers with custom alphabets for shortlinks and public resources.
- **`random-string`**: General-purpose text generation with built-in presets (symbols, numbers, alpha) for non-security fixtures.

---

# Security Notes

1. **Cryptographic Randomness**: All random operations utilize Node.js built-in `node:crypto` (`randomBytes`, `randomInt`). Never `Math.random()`.
2. **Modulo Bias Prevention**: All alphabet mapping and range selection employ rejection sampling or unbiased native integer generation.
3. **Secrets vs. Identifiers**: Never use short IDs or username generators for authentication secrets or password reset tokens. Use `generateSecureId({ bytes: 32, encoding: "base64url" })`.
4. **Availability Disclaimer**: Business name domain hints and generated usernames represent candidate strings only and do not query any DNS servers or third-party platforms.

---

# Runtime Requirements

- Node.js 18.0.0 or higher
- Zero runtime dependencies (`node:crypto` built-in)
- Server-side / Node.js environments

---

# ESM and CommonJS Usage

### ESM

```ts
import { uuidV4, generateNanoId } from "@rahul_dadhich15/id-toolkit";
```

### CommonJS

```js
const { uuidV4, generateNanoId } = require("@rahul_dadhich15/id-toolkit");
```

---

# Project Structure

```text
id-toolkit/
├── src/
│   ├── business-name/
│   │   ├── data/
│   │   │   └── components.ts
│   │   ├── business-name.ts
│   │   └── index.ts
│   ├── nanoid/
│   │   ├── nanoid.ts
│   │   └── index.ts
│   ├── random-name/
│   │   ├── data/
│   │   │   └── names.ts
│   │   ├── random-name.ts
│   │   └── index.ts
│   ├── random-number/
│   │   ├── random-number.ts
│   │   └── index.ts
│   ├── random-string/
│   │   ├── random-string.ts
│   │   └── index.ts
│   ├── random-word/
│   │   ├── data/
│   │   │   └── words.ts
│   │   ├── random-word.ts
│   │   └── index.ts
│   ├── secure-id/
│   │   ├── secure-id.ts
│   │   └── index.ts
│   ├── short-id/
│   │   ├── short-id.ts
│   │   └── index.ts
│   ├── ulid/
│   │   ├── ulid.ts
│   │   └── index.ts
│   ├── username-generate/
│   │   ├── data/
│   │   │   └── words.ts
│   │   ├── username-generate.ts
│   │   └── index.ts
│   ├── uuid-generator/
│   │   ├── uuid-generator.ts
│   │   └── index.ts
│   ├── uuid-validator/
│   │   ├── uuid-validator.ts
│   │   └── index.ts
│   └── index.ts
│
├── tests/
│   ├── business-name.test.ts
│   ├── nanoid.test.ts
│   ├── random-name.test.ts
│   ├── random-number.test.ts
│   ├── random-string.test.ts
│   ├── random-word.test.ts
│   ├── secure-id.test.ts
│   ├── short-id.test.ts
│   ├── ulid.test.ts
│   ├── username-generate.test.ts
│   ├── uuid-generator.test.ts
│   └── uuid-validator.test.ts
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── README.md
├── LICENSE
├── package.json
├── package-lock.json
├── tsconfig.json
└── .gitignore
```

---

# Development

Clone the repository:

```bash
git clone https://github.com/rahuldadhich1517-sys/id-toolkit.git
cd id-toolkit
npm install
```

---

# Testing

The project uses [Vitest](https://vitest.dev/) for automated testing:

```bash
npm run test:run
```

Run in watch mode:

```bash
npm test
```

---

# Build

Compile dual ESM/CJS bundles and declaration files:

```bash
npm run build
```

Verify npm tarball contents:

```bash
npm pack --dry-run
```

---

# CI

Continuous integration is automated via GitHub Actions on every push and pull request:

```text
Checkout repository
        ↓
Setup Node.js
        ↓
Install dependencies (npm ci)
        ↓
Type check (npm run typecheck)
        ↓
Run tests (npm run test:run)
        ↓
Build package (npm run build)
        ↓
Validate npm package (npm pack --dry-run)
```

Repository:
https://github.com/rahuldadhich1517-sys/id-toolkit

---

# Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

---

# License

MIT © 2026 [Rahul Dadhich](https://github.com/rahuldadhich1517-sys)