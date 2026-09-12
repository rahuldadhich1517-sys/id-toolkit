# ID Toolkit

A lightweight, dependency-free TypeScript toolkit for generating, validating, and working with UUIDs, short IDs, and cryptographically secure identifiers.

[![npm version](https://img.shields.io/npm/v/@rahul_dadhich15/id-toolkit.svg)](https://www.npmjs.com/package/@rahul_dadhich15/id-toolkit)
[![npm downloads](https://img.shields.io/npm/dm/@rahul_dadhich15/id-toolkit.svg)](https://www.npmjs.com/package/@rahul_dadhich15/id-toolkit)
[![CI](https://github.com/rahuldadhich1517-sys/id-toolkit/actions/workflows/ci.yml/badge.svg)](https://github.com/rahuldadhich1517-sys/id-toolkit/actions/workflows/ci.yml)
[![License](https://img.shields.io/github/license/rahuldadhich1517-sys/id-toolkit)](https://github.com/rahuldadhich1517-sys/id-toolkit)

Generate UUIDs, validate UUIDs, create compact IDs, and generate cryptographically secure identifiers with a simple TypeScript API.

---

## Features

- UUID v4 generation
- UUID v7 generation
- Bulk UUID generation
- UUID validation
- UUID version detection
- Compact URL-friendly short IDs
- Custom short-ID alphabets
- Cryptographically secure IDs
- Hex and Base64URL encodings
- Bulk secure-ID generation
- Cryptographically secure randomness using Node.js `crypto`
- TypeScript-first API
- Full type declarations
- ESM + CommonJS support
- Zero runtime dependencies
- Built-in Vitest tests
- Tree-shakable package
- Lightweight and production-friendly

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
  generateSecureId,
  isUUID,
} from "@rahul_dadhich15/id-toolkit";

console.log(uuidV4());
// Example:
// 550e8400-e29b-41d4-a716-446655440000

console.log(uuidV7());
// Example:
// 0190f7a2-7b3c-7e42-8b91-2a4c7d8e9f10

console.log(generateShortId());
// Example:
// K8x2LmQ9pR7a

console.log(generateSecureId());
// Example:
// 8f3c9d2e4a7b1c6f0e8d5a3b9c2f7e1d...

console.log(isUUID("550e8400-e29b-41d4-a716-446655440000"));
// true
```

---

# UUID Generator

Generate standards-compliant UUID v4 and UUID v7 identifiers.

## UUID v4

UUID v4 is randomly generated.

```ts
import { uuidV4 } from "@rahul_dadhich15/id-toolkit";

const id = uuidV4();

console.log(id);
```

Example:

```text
550e8400-e29b-41d4-a716-446655440000
```

UUID v4 is useful for:

- Database identifiers
- API resource IDs
- Request IDs
- Entity identifiers
- Distributed systems

---

## UUID v7

UUID v7 includes a Unix timestamp component while retaining random data.

```ts
import { uuidV7 } from "@rahul_dadhich15/id-toolkit";

const id = uuidV7();

console.log(id);
```

Example:

```text
0190f7a2-7b3c-7e42-8b91-2a4c7d8e9f10
```

UUID v7 can be useful when identifiers benefit from timestamp ordering, such as:

- Database primary keys
- Event IDs
- Log identifiers
- Distributed systems
- Time-ordered records

---

## Generate Multiple UUIDs

Generate multiple UUIDs at once.

```ts
import { generateUUIDs } from "@rahul_dadhich15/id-toolkit";

const ids = generateUUIDs(5);

console.log(ids);
```

Generate UUID v7 identifiers:

```ts
const ids = generateUUIDs(5, "v7");
```

Supported versions:

```ts
type UUIDVersion = "v4" | "v7";
```

---

# UUID Validator

Validate UUID strings and optionally verify their version.

## Validate a UUID

```ts
import { isUUID } from "@rahul_dadhich15/id-toolkit";

isUUID("550e8400-e29b-41d4-a716-446655440000");
// true
```

Invalid UUID:

```ts
isUUID("hello-world");
// false
```

The function accepts `unknown`, making it convenient for validating external input.

```ts
isUUID(123);
// false
```

---

## Validate UUID Version

You can verify that a UUID is a specific version.

```ts
import { isUUID } from "@rahul_dadhich15/id-toolkit";

const id = "550e8400-e29b-41d4-a716-446655440000";

isUUID(id, 4);
// true

isUUID(id, 7);
// false
```

Supported UUID versions:

```ts
1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
```

---

## Get UUID Version

```ts
import { getUUIDVersion } from "@rahul_dadhich15/id-toolkit";

getUUIDVersion("550e8400-e29b-41d4-a716-446655440000");
// 4
```

Invalid input:

```ts
getUUIDVersion("invalid");
// null
```

---

# Short ID

Generate compact, URL-friendly identifiers.

```ts
import { generateShortId } from "@rahul_dadhich15/id-toolkit";

const id = generateShortId();

console.log(id);
```

Example:

```text
K8x2LmQ9pR7a
```

Default length:

```text
12 characters
```

The default alphabet contains:

```text
0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz
```

Short IDs are useful for:

- Public URLs
- Short links
- Temporary references
- Human-friendly resource IDs
- Tracking identifiers

---

## Custom Length

```ts
const id = generateShortId({
  length: 16,
});
```

---

## Custom Alphabet

```ts
const id = generateShortId({
  length: 10,
  alphabet: "0123456789",
});
```

Example:

```text
4829137051
```

Custom alphabets must:

- Contain at least 2 characters
- Contain unique characters
- Contain no more than 256 characters

The generator uses rejection sampling to avoid modulo bias.

---

## Generate Multiple Short IDs

```ts
import { generateShortIds } from "@rahul_dadhich15/id-toolkit";

const ids = generateShortIds(10);

console.log(ids);
```

With options:

```ts
const ids = generateShortIds(10, {
  length: 16,
});
```

---

# Secure ID

Generate cryptographically strong random identifiers using Node.js `crypto.randomBytes`.

```ts
import { generateSecureId } from "@rahul_dadhich15/id-toolkit";

const id = generateSecureId();

console.log(id);
```

The default configuration generates:

```text
32 random bytes
```

encoded as hexadecimal.

That produces:

```text
64 hexadecimal characters
```

---

## Hex Encoding

```ts
const id = generateSecureId({
  bytes: 32,
  encoding: "hex",
});
```

---

## Base64URL Encoding

Generate URL-safe identifiers using Base64URL encoding.

```ts
const id = generateSecureId({
  bytes: 32,
  encoding: "base64url",
});
```

Base64URL is useful when identifiers need to be safely embedded in:

- URLs
- Cookies
- Tokens
- Query parameters
- Web APIs

---

## Custom Entropy

You can control the number of random bytes.

```ts
const id = generateSecureId({
  bytes: 16,
});
```

For stronger identifiers:

```ts
const id = generateSecureId({
  bytes: 64,
});
```

The supported range is:

```text
1 - 1024 bytes
```

---

## Generate Multiple Secure IDs

```ts
import { generateSecureIds } from "@rahul_dadhich15/id-toolkit";

const ids = generateSecureIds(5);

console.log(ids);
```

With options:

```ts
const ids = generateSecureIds(5, {
  bytes: 32,
  encoding: "base64url",
});
```

---

# API Reference

## UUID

| Function | Description |
|---|---|
| `uuidV4()` | Generate a UUID v4 |
| `uuidV7()` | Generate a UUID v7 |
| `generateUUIDs(count, version?)` | Generate multiple UUIDs |

---

## UUID Validation

| Function | Description |
|---|---|
| `isUUID(value, version?)` | Validate a UUID |
| `getUUIDVersion(value)` | Get UUID version |

---

## Short IDs

| Function | Description |
|---|---|
| `generateShortId(options?)` | Generate a short ID |
| `generateShortIds(count, options?)` | Generate multiple short IDs |

---

## Secure IDs

| Function | Description |
|---|---|
| `generateSecureId(options?)` | Generate a secure identifier |
| `generateSecureIds(count, options?)` | Generate multiple secure identifiers |

---

# TypeScript Types

The package includes complete TypeScript declarations.

### Short ID Options

```ts
interface ShortIdOptions {
  length?: number;
  alphabet?: string;
}
```

### Secure ID Options

```ts
interface SecureIdOptions {
  bytes?: number;
  encoding?: "hex" | "base64url";
}
```

### UUID Generator Version

```ts
type UUIDGeneratorVersion = "v4" | "v7";
```

### UUID Validator Version

```ts
type UUIDValidatorVersion =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8;
```

---

# Which ID Should I Use?

| Use Case | Recommended |
|---|---|
| Random standard identifier | UUID v4 |
| Time-sortable identifier | UUID v7 |
| Compact public identifier | Short ID |
| Security-sensitive random value | Secure ID |
| URL-safe secure identifier | Secure ID + Base64URL |
| Validate incoming UUID | `isUUID()` |
| Detect UUID version | `getUUIDVersion()` |

### Important Security Note

Short IDs are designed primarily for compactness and usability.

For security-sensitive values such as:

- Reset tokens
- Authentication tokens
- Session secrets
- API secrets
- Password-reset links
- Cryptographic nonces

prefer `generateSecureId()`.

Do not rely on short IDs as secrets simply because they are randomly generated.

---

# Runtime Dependencies

ID Toolkit has **zero runtime dependencies**.

It uses Node.js built-in cryptographic functionality:

```ts
node:crypto
```

This keeps the package lightweight and reduces dependency and supply-chain risk.

---

# ESM and CommonJS

ID Toolkit supports both modern ESM and CommonJS environments.

### ESM

```ts
import { uuidV4 } from "@rahul_dadhich15/id-toolkit";
```

### CommonJS

```js
const { uuidV4 } = require("@rahul_dadhich15/id-toolkit");
```

---

# Requirements

- Node.js 18+
- TypeScript 5+ recommended

Because the package uses Node.js `crypto`, it is primarily intended for Node.js/server-side applications.

---

# Development

Clone the repository:

```bash
git clone https://github.com/rahuldadhich1517-sys/id-toolkit.git
cd id-toolkit
```

Install dependencies:

```bash
npm install
```

---

## Type Check

```bash
npm run typecheck
```

---

## Run Tests

```bash
npm run test:run
```

Run Vitest in watch mode:

```bash
npm test
```

---

## Build

```bash
npm run build
```

---

## Validate Package Contents

```bash
npm pack --dry-run
```

---

# Project Structure

```text
id-toolkit/
├── src/
│   ├── uuid-generator/
│   │   ├── uuid-generator.ts
│   │   └── index.ts
│   │
│   ├── uuid-validator/
│   │   ├── uuid-validator.ts
│   │   └── index.ts
│   │
│   ├── short-id/
│   │   ├── short-id.ts
│   │   └── index.ts
│   │
│   ├── secure-id/
│   │   ├── secure-id.ts
│   │   └── index.ts
│   │
│   └── index.ts
│
├── tests/
│   ├── uuid-generator.test.ts
│   ├── uuid-validator.test.ts
│   ├── short-id.test.ts
│   └── secure-id.test.ts
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

# Testing

The project uses [Vitest](https://vitest.dev/) for automated testing.

Tests cover:

- UUID v4 generation
- UUID v7 generation
- UUID validation
- UUID version detection
- Short ID generation
- Custom alphabets
- Secure ID generation
- Encoding options
- Invalid input handling
- Boundary conditions

Run the full test suite:

```bash
npm run test:run
```

---

# CI

The repository includes GitHub Actions CI.

Every push and pull request runs:

```text
Install dependencies
        ↓
Type check
        ↓
Run tests
        ↓
Build package
        ↓
Validate npm package
```

GitHub repository:

https://github.com/rahuldadhich1517-sys/id-toolkit

---

# Performance

ID Toolkit is designed to remain lightweight and efficient.

It:

- Uses Node.js native cryptographic APIs
- Has zero runtime dependencies
- Supports tree shaking
- Avoids unnecessary abstractions
- Provides bulk generation helpers
- Uses rejection sampling for unbiased short-ID generation

For extremely large bulk-generation workloads, consider memory usage before generating millions of identifiers in a single array.

---

# Contributing

Contributions, bug reports, and feature requests are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Add or update tests.
5. Run:

```bash
npm run typecheck
npm run test:run
npm run build
```

6. Submit a pull request.

---

# License

MIT © 2026 Rahul Dadhich

---

# Author

**Rahul Dadhich**

GitHub:

https://github.com/rahuldadhich1517-sys

Repository:

https://github.com/rahuldadhich1517-sys/id-toolkit

---

# Changelog

## 0.1.0

Initial release.

### Included

- UUID v4 generation
- UUID v7 generation
- Bulk UUID generation
- UUID validation
- UUID version detection
- Short ID generation
- Custom short-ID alphabets
- Secure ID generation
- Hex encoding
- Base64URL encoding
- Bulk secure-ID generation
- TypeScript declarations
- ESM + CommonJS support
- Vitest test suite
- GitHub Actions CI