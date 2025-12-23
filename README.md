# AlgoKit Consistency Analysis

This repository contains comprehensive consistency analysis across 17 AlgoKit repositories, organized to enable standardization and best practice sharing across the ecosystem.

## Overview

This meta-analysis project examines CI/CD workflows, branching strategies, testing approaches, release automation, and documentation practices across the entire AlgoKit ecosystem. The goal is to identify inconsistencies, risks, and opportunities for standardization.

- **Total Repositories Analyzed**: 17
- **Categories**: 9 (based on language, distribution model, and build complexity)
- **Analysis Methodology**: Standardized 35-step process per repository

## Repository Structure

```
algokit-consistency-analysis/
├── website/                       # Astro-powered website
│   ├── src/                       # Website source code
│   └── README.md                  # Website documentation
│
├── docs/                          # Process documentation
│   ├── REPO-CATEGORIZATION-LOGIC.md    # How repos are categorized
│   └── SINGLE-REPO-ANALYSIS-PLAN.md    # Analysis methodology
│
├── analysis/                      # All analysis outputs
│   ├── README.md                  # Navigation hub (start here!)
│   ├── by-category/               # Analyses grouped by repo category
│   ├── by-tech-stack/             # Alternative view by language
│   └── aggregated/                # Cross-repo synthesis (coming soon)
│
└── [17 submodules]/               # The analyzed repositories (root level)
```

## Quick Start

### 1. View the Website

Visit the interactive website to browse all analysis results:

**Live Site**: [https://mrcointreau.github.io/algokit-consistency-analysis/](https://mrcointreau.github.io/algokit-consistency-analysis/)

Or read the Markdown files directly in [analysis/README.md](analysis/README.md).

### 2. Clone and Initialize (for development)

```bash
# Clone the repository
git clone https://github.com/mrcointreau/algokit-consistency-analysis.git
cd algokit-consistency-analysis

# Initialize all submodules
chmod +x setup_submodules.sh
./setup_submodules.sh
```

Or clone with submodules in one command:

```bash
git clone --recurse-submodules https://github.com/mrcointreau/algokit-consistency-analysis.git
```

### 3. Run Website Locally

```bash
cd website
npm install
npm run dev
```

The site will be available at `http://localhost:4321/`

**Note:** The development server uses the root path `/` for simplicity. The base path `/algokit-consistency-analysis/` is only applied for production builds deployed to GitHub Pages.

## Documentation

- **[Repository Categorization Logic](docs/REPO-CATEGORIZATION-LOGIC.md)** - Explains the 9-category classification system
- **[Single Repository Analysis Plan](docs/SINGLE-REPO-ANALYSIS-PLAN.md)** - The standardized 35-step analysis methodology
- **[Analysis Hub](analysis/README.md)** - Central index of all analyses with quick reference table

## Analyzed Repositories

This project analyzes the following 17 AlgoKit repositories:

**Python Repositories (6)**
- algokit-utils-py (alpha branch)
- algokit-subscriber-py (main)
- algokit-cli (main)
- algokit-client-generator-py (main)
- puya (main)
- algorand-python-testing (main)

**TypeScript Repositories (11)**
- algokit-utils-ts (decoupling branch)
- algokit-utils-ts-debug (main)
- algokit-subscriber-ts (main)
- algorand-typescript-testing (main)
- algokit-client-generator-ts (main)
- puya-ts (main)
- algokit-avm-debugger (main)
- algokit-lora (main)
- algokit-avm-vscode-debugger (main)
- algokit-dispenser-api (main)
- algokit-example-gallery (main)

## Analysis Categories

Repositories are grouped into 9 categories for comparison and standardization:

1. **Python Library** (2 repos) - PyPI libraries
2. **Python CLI Tool** (2 repos) - Command-line tools
3. **Python Compiler** (2 repos) - Language tools with LSP
4. **TypeScript Library** (4 repos) - npm libraries
5. **TypeScript CLI Tool** (3 repos) - CLI tools
6. **Frontend Web App** (1 repo) - React/Vite applications
7. **VSCode Extension** (1 repo) - Editor extensions
8. **Serverless Backend** (1 repo) - AWS Lambda APIs
9. **Static Site** (1 repo) - Documentation sites

See [docs/REPO-CATEGORIZATION-LOGIC.md](docs/REPO-CATEGORIZATION-LOGIC.md) for the rationale behind this categorization.

## Working with Submodules

### Update All Submodules

To pull the latest commits from all tracked branches:

```bash
git submodule update --remote
```

### Update a Specific Submodule

```bash
git submodule update --remote <submodule-name>
```

### Check Submodule Status

```bash
git submodule status
```

## Contributing

When adding a new repository analysis:

1. Add the repository as a submodule in the root directory
2. Follow the [analysis methodology](docs/SINGLE-REPO-ANALYSIS-PLAN.md)
3. Place the analysis report in the appropriate `analysis/by-category/` folder
4. Create a symlink in `analysis/by-tech-stack/`
5. Update [analysis/README.md](analysis/README.md) with the new entry

## Analysis Outputs

- **Individual Repository Analyses**: 17 detailed reports in [analysis/by-category/](analysis/by-category/)
- **Cross-Repository Summary**: _(Coming soon)_ Patterns and inconsistencies across all repos
- **Executive Summary**: _(Coming soon)_ High-level findings and recommendations
