# TypeScript Library Reference Implementation

[![npm version](https://badge.fury.io/js/@algorandfoundation%2Ftypescript-library-reference-implementation.svg)](https://badge.fury.io/js/@algorandfoundation%2Ftypescript-library-reference-implementation)
[![Node.js 22+](https://img.shields.io/badge/node-22+-blue.svg)](https://nodejs.org/en/download/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

TypeScript library reference implementation for the AlgoKit ecosystem.

## Overview

This is a template repository demonstrating best practices for TypeScript library development in the Algorand ecosystem, including:

- **Trunk-based development** with beta and production releases
- **Automated CI/CD** with GitHub Actions
- **Semantic versioning** with semantic-release
- **Comprehensive testing** with Vitest and coverage reporting
- **Type checking** with TypeScript strict mode
- **Code formatting and linting** with ESLint and Prettier
- **Documentation** with TypeDoc
- **Commit linting** with commitlint for conventional commits

## Installation

```bash
npm install @algorandfoundation/typescript-library-reference-implementation
```

Or with pnpm:

```bash
pnpm add @algorandfoundation/typescript-library-reference-implementation
```

## Quick Start

```typescript
import { add, greet } from '@algorandfoundation/typescript-library-reference-implementation'

// Add two numbers
const result = add(2, 3)
console.log(result) // Output: 5

// Generate a greeting
const message = greet('World')
console.log(message) // Output: Hello, World!
```

## Development

### Prerequisites

- Node.js 22+
- npm (or pnpm)

### Setup

```bash
# Clone the repository
git clone https://github.com/algorandfoundation/typescript-library-reference-implementation.git
cd typescript-library-reference-implementation

# Install dependencies
npm install
```

### Common Commands

```bash
# Run tests
npm test

# Run tests with coverage
npm run test -- --coverage

# Lint code
npm run lint

# Format code
npm run format

# Type check
npm run check-types

# Build
npm run build
```

## Release Strategy

This project uses trunk-based development:

| Branch    | Release Type     | Example Version |
| --------- | ---------------- | --------------- |
| `main`    | Beta pre-release | `0.1.0-beta.1`  |
| `release` | Production       | `0.1.0`         |

### Automatic Releases

- **Push to main** triggers automatic beta release to npm
- **Manual workflow** promotes main to release for production releases

## License

MIT License - see [LICENSE](LICENSE) for details.

## Contributing

Contributions are welcome!
