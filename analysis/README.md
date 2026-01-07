# AlgoKit Repository Analysis Hub

This directory contains comprehensive analysis of all 17 AlgoKit repositories, organized for easy navigation and comparison.

## Quick Navigation

- **[By Category](#analyses-by-category)** - Browse analyses grouped by repository type (recommended for comparing similar repos)
- **[By Tech Stack](#analyses-by-tech-stack)** - Browse analyses grouped by programming language
- **[Aggregated Reports](#aggregated-cross-repo-analysis)** - Cross-repository synthesis and patterns

## Analyses by Category

The repositories are organized into 9 categories based on language, distribution model, and build complexity. See [../docs/REPO-CATEGORIZATION-LOGIC.md](../docs/REPO-CATEGORIZATION-LOGIC.md) for the categorization rationale.

### Category 1: Python Library (2 repos)
Python libraries distributed via PyPI without CLI entry points.

- [algokit-utils-py](by-category/01-python-library/algokit-utils-py-analysis.md)
- [algokit-subscriber-py](by-category/01-python-library/algokit-subscriber-py-analysis.md)

**Comparative Reports:**
- [Comparative Analysis](by-category/01-python-library/comparative-analysis.md) - Quick comparison table
- [GitHub Workflows Comparison](by-category/01-python-library/github-workflows-comparison-report.md) - Detailed CI/CD analysis

### Category 2: Python CLI Tool (2 repos)
Python command-line applications distributed via PyPI with CLI entry points.

- [algokit-cli](by-category/02-python-cli-tool/algokit-cli-analysis.md)
- [algokit-client-generator-py](by-category/02-python-cli-tool/algokit-client-generator-py-analysis.md)

### Category 3: Python Compiler/Language Tool (2 repos)
Python language tools with compilation capabilities and LSP server support.

- [puya](by-category/03-python-compiler/puya-analysis.md)
- [algorand-python-testing](by-category/03-python-compiler/algorand-python-testing-analysis.md)

### Category 4: TypeScript Library (4 repos)
TypeScript/JavaScript libraries distributed via npm without CLI entry points.

- [algokit-utils-ts](by-category/04-typescript-library/algokit-utils-ts-analysis.md)
- [algokit-utils-ts-debug](by-category/04-typescript-library/algokit-utils-ts-debug-analysis.md)
- [algokit-subscriber-ts](by-category/04-typescript-library/algokit-subscriber-ts-analysis.md)
- [algorand-typescript-testing](by-category/04-typescript-library/algorand-typescript-testing-analysis.md)

**Comparative Reports:**
- [Comparative Analysis](by-category/04-typescript-library/comparative-analysis.md) - Quick comparison table
- [GitHub Workflows Comparison](by-category/04-typescript-library/github-workflows-comparison-report.md) - Detailed CI/CD analysis

### Category 5: TypeScript CLI Tool (3 repos)
TypeScript command-line applications distributed via npm with bin entry points.

- [algokit-client-generator-ts](by-category/05-typescript-cli-tool/algokit-client-generator-ts-analysis.md)
- [puya-ts](by-category/05-typescript-cli-tool/puya-ts-analysis.md)
- [algokit-avm-debugger](by-category/05-typescript-cli-tool/algokit-avm-debugger-analysis.md)

### Category 6: Frontend Web Application (1 repo)
React-based single-page application deployed to web hosting.

- [algokit-lora](by-category/06-frontend-web-app/algokit-lora-analysis.md)

### Category 7: VSCode Extension (1 repo)
Visual Studio Code editor extension distributed via VSCode Marketplace.

- [algokit-avm-vscode-debugger](by-category/07-vscode-extension/algokit-avm-vscode-debugger-analysis.md)

### Category 8: Serverless Backend API (1 repo)
AWS Lambda-based serverless API with Infrastructure as Code.

- [algokit-dispenser-api](by-category/08-serverless-backend/algokit-dispenser-api-analysis.md)

### Category 9: Static Documentation Site (1 repo)
Static site generator for documentation with CDN deployment.

- [algokit-example-gallery](by-category/09-static-site/algokit-example-gallery-analysis.md)

## Analyses by Tech Stack

Alternative organization by programming language for tech-stack-focused comparisons.

### Python Repositories (6 repos)
- [algokit-utils-py](by-tech-stack/python/algokit-utils-py-analysis.md)
- [algokit-subscriber-py](by-tech-stack/python/algokit-subscriber-py-analysis.md)
- [algokit-cli](by-tech-stack/python/algokit-cli-analysis.md)
- [algokit-client-generator-py](by-tech-stack/python/algokit-client-generator-py-analysis.md)
- [puya](by-tech-stack/python/puya-analysis.md)
- [algorand-python-testing](by-tech-stack/python/algorand-python-testing-analysis.md)

### TypeScript Repositories (11 repos)
- [algokit-utils-ts](by-tech-stack/typescript/algokit-utils-ts-analysis.md)
- [algokit-utils-ts-debug](by-tech-stack/typescript/algokit-utils-ts-debug-analysis.md)
- [algokit-subscriber-ts](by-tech-stack/typescript/algokit-subscriber-ts-analysis.md)
- [algorand-typescript-testing](by-tech-stack/typescript/algorand-typescript-testing-analysis.md)
- [algokit-client-generator-ts](by-tech-stack/typescript/algokit-client-generator-ts-analysis.md)
- [puya-ts](by-tech-stack/typescript/puya-ts-analysis.md)
- [algokit-avm-debugger](by-tech-stack/typescript/algokit-avm-debugger-analysis.md)
- [algokit-lora](by-tech-stack/typescript/algokit-lora-analysis.md)
- [algokit-avm-vscode-debugger](by-tech-stack/typescript/algokit-avm-vscode-debugger-analysis.md)
- [algokit-dispenser-api](by-tech-stack/typescript/algokit-dispenser-api-analysis.md)
- [algokit-example-gallery](by-tech-stack/typescript/algokit-example-gallery-analysis.md)

## Aggregated Cross-Repo Analysis

Synthesis reports identifying patterns, inconsistencies, and standardization opportunities across all repositories.

- [Cross-Repository Summary](aggregated/cross-repo-summary.md) _(Coming soon)_
- [Executive Summary](aggregated/executive-summary.md) _(Coming soon)_

## Analysis Methodology

Each repository analysis follows a standardized 35-step methodology covering:

1. **Context Gathering** - Tech stack, purpose, monorepo structure
2. **CI/CD Analysis** - Workflows, actions, runtime versions, release automation
3. **Branching Strategy** - Commit conventions, release branches, trunk-based compliance
4. **Release & Versioning** - Mechanisms, tag formats, version sources
5. **Testing** - Frameworks, coverage, CI enforcement
6. **Documentation** - Tooling, generation, publishing automation
7. **Synthesis** - Gaps, risks, standardization opportunities

See [../docs/SINGLE-REPO-ANALYSIS-PLAN.md](../docs/SINGLE-REPO-ANALYSIS-PLAN.md) for the complete methodology.

## Quick Reference Table

| Repository | Category | Tech Stack | Distribution | Analysis |
|------------|----------|------------|--------------|----------|
| algokit-utils-py | Python Library | Python | PyPI | [Analysis](by-category/01-python-library/algokit-utils-py-analysis.md) |
| algokit-subscriber-py | Python Library | Python | PyPI | [Analysis](by-category/01-python-library/algokit-subscriber-py-analysis.md) |
| algokit-cli | Python CLI Tool | Python | PyPI, Installers | [Analysis](by-category/02-python-cli-tool/algokit-cli-analysis.md) |
| algokit-client-generator-py | Python CLI Tool | Python | PyPI | [Analysis](by-category/02-python-cli-tool/algokit-client-generator-py-analysis.md) |
| puya | Python Compiler | Python | PyPI | [Analysis](by-category/03-python-compiler/puya-analysis.md) |
| algorand-python-testing | Python Compiler | Python | PyPI | [Analysis](by-category/03-python-compiler/algorand-python-testing-analysis.md) |
| algokit-utils-ts | TypeScript Library | TypeScript | npm (monorepo) | [Analysis](by-category/04-typescript-library/algokit-utils-ts-analysis.md) |
| algokit-utils-ts-debug | TypeScript Library | TypeScript | npm | [Analysis](by-category/04-typescript-library/algokit-utils-ts-debug-analysis.md) |
| algokit-subscriber-ts | TypeScript Library | TypeScript | npm | [Analysis](by-category/04-typescript-library/algokit-subscriber-ts-analysis.md) |
| algorand-typescript-testing | TypeScript Library | TypeScript | npm | [Analysis](by-category/04-typescript-library/algorand-typescript-testing-analysis.md) |
| algokit-client-generator-ts | TypeScript CLI Tool | TypeScript | npm | [Analysis](by-category/05-typescript-cli-tool/algokit-client-generator-ts-analysis.md) |
| puya-ts | TypeScript CLI Tool | TypeScript | npm (monorepo) | [Analysis](by-category/05-typescript-cli-tool/puya-ts-analysis.md) |
| algokit-avm-debugger | TypeScript CLI Tool | TypeScript | npm | [Analysis](by-category/05-typescript-cli-tool/algokit-avm-debugger-analysis.md) |
| algokit-lora | Frontend Web App | TypeScript/React | Web | [Analysis](by-category/06-frontend-web-app/algokit-lora-analysis.md) |
| algokit-avm-vscode-debugger | VSCode Extension | TypeScript | Marketplace | [Analysis](by-category/07-vscode-extension/algokit-avm-vscode-debugger-analysis.md) |
| algokit-dispenser-api | Serverless Backend | TypeScript | AWS | [Analysis](by-category/08-serverless-backend/algokit-dispenser-api-analysis.md) |
| algokit-example-gallery | Static Site | Astro | Static HTML | [Analysis](by-category/09-static-site/algokit-example-gallery-analysis.md) |

## Adding New Analyses

When analyzing a new repository:

1. Follow the methodology in [../docs/SINGLE-REPO-ANALYSIS-PLAN.md](../docs/SINGLE-REPO-ANALYSIS-PLAN.md)
2. Place the analysis in the appropriate `by-category/XX-category-name/` folder
3. Create a symlink in the appropriate `by-tech-stack/` folder
4. Update this README with the new entry

## Repository Overview Statistics

- **Total Repositories**: 17
- **Python Repositories**: 6 (35%)
- **TypeScript Repositories**: 11 (65%)
- **Libraries**: 6 (35%)
- **CLI Tools**: 5 (29%)
- **Specialized Tools**: 6 (36%)
  - 2 Compilers/Language Tools
  - 1 Web App
  - 1 VSCode Extension
  - 1 Backend API
  - 1 Static Site
