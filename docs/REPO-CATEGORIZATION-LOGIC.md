# AlgoKit Repository Categorization Logic

## Overview

This document explains how AlgoKit's 17 repositories are categorized to enable consistent tooling, CI/CD pipelines, and development practices across the ecosystem.


## Why Categorize by Language + Distribution Model?

Repositories are grouped based on **technical characteristics** rather than functional purpose to maximize code and configuration reuse:

1. **Same Language**: Repositories using the same programming language can share linters, formatters, and build tools
2. **Same Distribution Model**: Repositories with the same distribution model share packaging, testing, and deployment patterns
3. **Same Category**: Repositories in the same category share CI/CD workflows, tooling configurations, and development standards

### Example: Why "Python CLI Tool" vs "CLI Tool"

**Grouping by function alone** ("CLI Tools"):
- Includes both Python and TypeScript CLIs
- Incompatible linters (Ruff vs ESLint)
- Incompatible formatters (Black vs Prettier)
- Incompatible build tools (Poetry vs Rollup)

**Grouping by language and distribution** ("Python CLI Tool", "TypeScript CLI Tool"):
- Single language per category
- Shared tooling ecosystem
- Shared CLI-specific patterns (entry points, binary distribution)


## Categorization Principles

Repositories are categorized by three dimensions:

### 1. Primary Language
- **Python**: Uses Python tooling ecosystem (pip, pytest, Ruff/Black, Sphinx)
- **TypeScript**: Uses JavaScript tooling ecosystem (npm, Vitest/Jest, ESLint, TypeDoc)

### 2. Distribution Model
- **Library**: Consumed as a dependency by other projects
- **CLI Tool**: Installed and run as a command-line program
- **Web Application**: Deployed to web servers/hosting
- **IDE Extension**: Distributed via IDE marketplace
- **Backend Service**: Deployed to cloud infrastructure

### 3. Build Complexity
- **Simple**: Single package, standard build
- **Monorepo**: Multiple packages in one repository
- **Compiler**: Complex language tools with LSP/DAP
- **Infrastructure**: Cloud resources, IaC


## Categories

### Category 1: Python Library
**Purpose**: Python libraries for import by other Python projects

**Characteristics**:
- Distributed via PyPI
- Published without command-line interface

**Repositories**: algokit-utils-py, algokit-subscriber-py

### Category 2: Python CLI Tool
**Purpose**: Python command-line applications

**Characteristics**:
- Distributed via PyPI and installers
- Has CLI entry points
- Executable via command-line interface

**Repositories**: algokit-cli, algokit-client-generator-py

### Category 3: Python Compiler/Language Tool
**Purpose**: Python language tools with compilation capabilities and LSP servers

**Characteristics**:
- Provides compilation or language transformation capabilities
- LSP server for IDE integration
- Advanced features (vendored dependencies, multiple packages)

**Repositories**: puya, algorand-python-testing

### Category 4: TypeScript Library
**Purpose**: TypeScript/JavaScript libraries for import by other projects

**Characteristics**:
- Distributed via npm
- Published without command-line interface

**Repositories**: algokit-utils-ts, algokit-utils-ts-debug, algokit-subscriber-ts, algorand-typescript-testing

### Category 5: TypeScript CLI Tool
**Purpose**: TypeScript command-line applications

**Characteristics**:
- Distributed via npm with bin entry point
- Executable via command-line interface
- May include LSP/DAP for debugging tools

**Repositories**: algokit-client-generator-ts, puya-ts, algokit-avm-debugger

### Category 6: Frontend Web Application
**Purpose**: React-based single-page applications for browsers

**Characteristics**:
- React framework
- Vite build tool
- Deployed to web hosting platforms
- Not published to package registries

**Repositories**: algokit-lora

### Category 7: VSCode Extension
**Purpose**: Visual Studio Code editor extensions

**Characteristics**:
- VSCode extension manifest
- Distributed via VSCode Marketplace
- Packaged as .vsix
- May include debugger contributions

**Repositories**: algokit-avm-vscode-debugger

### Category 8: Serverless Backend API
**Purpose**: AWS Lambda-based serverless APIs

**Characteristics**:
- AWS infrastructure (Lambda, API Gateway, DynamoDB)
- Infrastructure as Code (SST/CDK)
- Monorepo with workspaces
- Environment-specific deployments

**Repositories**: algokit-dispenser-api

### Category 9: Static Documentation Site
**Purpose**: Static site generators for documentation

**Characteristics**:
- Static site generator (Astro)
- Git submodules for content
- CDN deployment
- Minimal runtime requirements

**Repositories**: algokit-example-gallery


## Repository Mapping

| Repository | Category | Language | Distribution |
|------------|----------|----------|--------------|
| algokit-utils-py | Python Library | Python | PyPI |
| algokit-subscriber-py | Python Library | Python | PyPI |
| algokit-cli | Python CLI Tool | Python | PyPI, Installers |
| algokit-client-generator-py | Python CLI Tool | Python | PyPI |
| puya | Python Compiler | Python | PyPI |
| algorand-python-testing | Python Compiler | Python | PyPI |
| algokit-utils-ts | TypeScript Library | TypeScript | npm (monorepo) |
| algokit-utils-ts-debug | TypeScript Library | TypeScript | npm |
| algokit-subscriber-ts | TypeScript Library | TypeScript | npm |
| algorand-typescript-testing | TypeScript Library | TypeScript | npm |
| algokit-client-generator-ts | TypeScript CLI Tool | TypeScript | npm |
| puya-ts | TypeScript CLI Tool | TypeScript | npm (monorepo) |
| algokit-avm-debugger | TypeScript CLI Tool | TypeScript | npm |
| algokit-lora | Frontend Web App | TypeScript/React | Web |
| algokit-avm-vscode-debugger | VSCode Extension | TypeScript | Marketplace |
| algokit-dispenser-api | Serverless Backend | TypeScript | AWS |
| algokit-example-gallery | Static Site | Astro | Static HTML |


## Special Cases

### Monorepo Repositories
**Affected**: algokit-utils-ts (9 packages), puya-ts (packages/algo-ts), algokit-dispenser-api (workspaces)

**Rationale**: Multiple related packages benefit from shared tooling and coordinated releases.


### Cross-Platform Distribution
**Affected**: algokit-cli

**Rationale**: Distributed via multiple channels including PyPI and platform-specific package managers for ease of installation.


### LSP/DAP Protocol Support
**Affected**: puya (LSP), puya-ts (LSP), algokit-avm-debugger (DAP), algokit-avm-vscode-debugger (DAP)

**Rationale**: Language tools and debuggers implement standard protocols for IDE integration.


## Benefits of This Categorization

1. **Consistent Tooling**: All repositories in a category share linting, formatting, and testing configurations
2. **Reusable CI/CD**: Create one workflow per category, reuse across all repositories in that category
3. **Easier Maintenance**: Update shared configs once, propagate automatically to all repositories
4. **Better Onboarding**: New contributors quickly understand repository structure and tooling
5. **Quality Standards**: Standardized patterns ensure consistent quality across the ecosystem


## Summary

AlgoKit repositories are categorized into **9 templates** based on:
- **Language** (Python vs TypeScript)
- **Distribution model** (Library, CLI, Web App, Extension, API, Static Site)
- **Build complexity** (Simple, Monorepo, Compiler, Infrastructure)

This enables maximum code and configuration reuse while maintaining clear boundaries between different types of projects.
