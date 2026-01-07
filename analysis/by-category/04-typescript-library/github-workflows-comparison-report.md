
## Executive Summary

This report compares the GitHub Actions and CI/CD configurations across 4 TypeScript repositories in the AlgoKit ecosystem. All four repositories (subscriber-ts, utils-ts, utils-ts-debug, algorand-typescript-testing) share a similar CI/CD pattern with semantic-release and conventional commits, though with some variations in implementation.

---

## 1. Repository Overview

| Repository | Workflows | CI Pattern | Release Automation |
|------------|:---------:|------------|-------------------|
| algokit-subscriber-ts | 3 | makerxstudio shared workflow | semantic-release |
| algokit-utils-ts | 3 | Custom composite action + polytest | semantic-release |
| algokit-utils-ts-debug | 3 | makerxstudio shared workflow | semantic-release |
| algorand-typescript-testing | 5 | Local reusable workflow (node-ci.yml) | semantic-release |

---

## 2. Detailed Analysis by Repository

### 2.1 algokit-subscriber-ts

#### Workflows
| File | Triggers | Purpose |
|------|----------|---------|
| `pr.yml` | PR to main/alpha | CI validation + doc check |
| `release.yml` | Push to main/release/alpha, manual | Full CI/CD + semantic-release |
| `prod_release.yml` | Manual only | Sync main ↔ release branches |

#### Actions Used
| Action | Version | Notes |
|--------|---------|-------|
| `actions/checkout` | v3, v4 | v3 in check_docs, v4 in release |
| `actions/setup-node` | v3 | Node 20.x for semantic-release |
| `actions/create-github-app-token` | v1 | Bot token generation |
| `actions/download-artifact` | v4 | Download built package |
| `devmasx/merge-branch` | `854d3ac71ed1e9deb668e0074781b81fdd6e771f` | Pinned to SHA |
| `makerxstudio/shared-config/node-ci.yml` | @main | Reusable CI workflow |
| `makerxstudio/shared-config/node-build-zip.yml` | @main | Reusable build workflow |

#### Conventional Commits
- **Config File**: `commitlint.config.cjs`
- **Extends**: `@commitlint/config-conventional`
- **Custom Rules**: subject-case allows pascal-case/upper-case, body-max-line-length: 200, header-max-length: 150
- **Enforcement**: Via `run-commit-lint: true` in shared workflow

#### Semantic Release
- **Config Location**: `package.json` (embedded under `"release"` key)
- **Branches**: main (beta), alpha (alpha), release (stable)
- **Release Rules**: build→patch, chore→patch
- **Node Version**: 22.x

#### Package Versions
| Package | Version |
|---------|---------|
| `semantic-release` | ^25.0.2 |
| `@commitlint/cli` | ^19.2.1 |
| `@commitlint/config-conventional` | ^19.1.0 |
| `conventional-changelog-conventionalcommits` | ^7.0.2 |

#### Dependabot
- **Schedule**: Weekly
- **Commit Prefix**: None (default)
- **Grouping**: None

---

### 2.2 algokit-utils-ts

#### Workflows
| File | Triggers | Purpose |
|------|----------|---------|
| `pr.yml` | PR to main/decoupling | CI validation + doc check |
| `release.yml` | Push to main/release/decoupling, manual | Full CI/CD + semantic-release |
| `prod_release.yml` | Manual only | Sync main ↔ release branches |

#### Actions Used
| Action | Version | Notes |
|--------|---------|-------|
| `actions/checkout` | v3, v4 | v3 in check_docs, v4 in CI/release |
| `actions/setup-node` | v3, v4 | v4 in PR, v3 in release |
| `actions/create-github-app-token` | v1 | Bot token generation |
| `actions/download-artifact` | v4 | Download built package |
| `devmasx/merge-branch` | `854d3ac71ed1e9deb668e0074781b81fdd6e771f` | Pinned to SHA |
| `algorandfoundation/algokit-polytest/setup-polytest` | @main | Polytest setup |
| `algorandfoundation/algokit-polytest/run-mock-server` | @main | Mock servers |
| `makerxstudio/shared-config/node-build-zip.yml` | @main | Reusable build workflow |
| `.github/actions/ci` | local | Custom composite action |

#### Conventional Commits
- **Config File**: `commitlint.config.cjs`
- **Extends**: `@commitlint/config-conventional`
- **Custom Rules**: Same as subscriber-ts
- **Enforcement**: Via custom composite action with commit range validation

#### Semantic Release
- **Config Location**: `package.json` (embedded under `"release"` key)
- **Branches**: main (beta), decoupling (alpha), release (stable)
- **Release Rules**: build→patch, chore→patch, **refactor→patch** (unique)
- **Node Version**: 20.x

#### Package Versions
| Package | Version |
|---------|---------|
| `semantic-release` | ^24.1.2 |
| `@commitlint/cli` | ^19.5.0 |
| `@commitlint/config-conventional` | ^19.5.0 |
| `conventional-changelog-conventionalcommits` | 8.0.0 |

#### Dependabot
- **Schedule**: Weekly
- **Commit Prefix**: `chore(deps)`
- **Grouping**: All deps grouped, minor+patch only

---

### 2.3 algokit-utils-ts-debug

#### Workflows
| File | Triggers | Purpose |
|------|----------|---------|
| `pr.yml` | PR to main/alpha | CI validation + doc check |
| `release.yml` | Push to main/release/alpha, manual | Full CI/CD + semantic-release |
| `prod_release.yml` | Manual only | Sync main ↔ release branches |

#### Actions Used
| Action | Version | Notes |
|--------|---------|-------|
| `actions/checkout` | v3 | All workflows |
| `actions/setup-node` | v3 | Node 20.x |
| `actions/create-github-app-token` | v1 | Bot token generation |
| `actions/download-artifact` | v4 | Download built package |
| `devmasx/merge-branch` | `854d3ac71ed1e9deb668e0074781b81fdd6e771f` | Pinned to SHA |
| `makerxstudio/shared-config/node-ci.yml` | @main | Reusable CI workflow |
| `makerxstudio/shared-config/node-build-zip.yml` | @main | Reusable build workflow |

#### Conventional Commits
- **Config File**: `commitlint.config.cjs`
- **Extends**: `@commitlint/config-conventional`
- **Custom Rules**: Same as subscriber-ts
- **Enforcement**: Via `run-commit-lint: true` in shared workflow

#### Semantic Release
- **Config Location**: `package.json` (embedded under `"release"` key)
- **Branches**: main (beta), alpha (alpha), release (stable)
- **Release Rules**: build→patch, chore→patch
- **Node Version**: 20.x

#### Package Versions
| Package | Version |
|---------|---------|
| `semantic-release` | ^25.0.2 |
| `@commitlint/cli` | ^20.2.0 |
| `@commitlint/config-conventional` | ^20.2.0 |
| `conventional-changelog-conventionalcommits` | 9.1.0 |

#### Dependabot
- **Schedule**: Weekly
- **Commit Prefix**: `chore(deps)`
- **Grouping**: All deps grouped, minor+patch only

---

### 2.4 algorand-typescript-testing

#### Workflows
| File | Triggers | Purpose |
|------|----------|---------|
| `pr.yml` | PR to main/alpha | CI validation via node-ci.yml |
| `release.yml` | Push to main/release/alpha, manual | Full CI/CD + semantic-release |
| `prod-release.yml` | Manual only | Sync main ↔ release branches |
| `node-ci.yml` | Reusable workflow | Shared CI logic (build, test, lint, commit-lint) |
| `gh-pages.yml` | Called from release.yml | Deploy docs to GitHub Pages |

#### Actions Used
| Action | Version | Notes |
|--------|---------|-------|
| `actions/checkout` | v4 | All workflows |
| `actions/setup-node` | v4 | Node 22.x |
| `actions/create-github-app-token` | v1 | Bot token generation |
| `actions/download-artifact` | v4 | Download built package |
| `actions/upload-artifact` | v4 | Upload build artifacts |
| `actions/upload-pages-artifact` | v3 | Pages deployment |
| `actions/deploy-pages` | v4 | Pages deployment |
| `phoenix-actions/test-reporting` | v10 | Test result publishing |

#### Conventional Commits
- **Config File**: `commitlint.config.cjs`
- **Extends**: `@commitlint/config-conventional`
- **Custom Rules**: Same as other repos (subject-case, body-max-line-length: 200, header-max-length: 150)
- **Enforcement**: Via `run-commit-lint: true` in node-ci.yml

#### Semantic Release
- **Config Location**: `.releaserc.json` (standalone file)
- **Branches**: main (beta), alpha (alpha), release (stable)
- **Release Rules**: build→patch, chore→patch, refactor→patch
- **Node Version**: 22.x

#### Package Versions
| Package | Version |
|---------|---------|
| `semantic-release` | ^24.2.9 |
| `@commitlint/cli` | ^19.8.0 |
| `@commitlint/config-conventional` | ^19.8.0 |
| `conventional-changelog-conventionalcommits` | ^8.0.0 |

#### Other Configurations
- **Dependabot**: Not configured
- **Issue Templates**: bug_report.md, feature_request.md
- **PR Template**: None

---

## 3. Release Strategy Deep Dive

This section provides comprehensive details on how each repository handles releases, including NPM publishing, build configuration, and the complete release pipeline.

### 3.1 NPM Package Configuration

| Aspect | subscriber-ts | utils-ts | utils-ts-debug | testing |
|--------|---------------|----------|----------------|---------|
| **Package Name** | `@algorandfoundation/algokit-subscriber` | `@algorandfoundation/algokit-utils` | `@algorandfoundation/algokit-utils-debug` | `@algorandfoundation/algorand-typescript-testing` |
| **Registry** | NPM Public | NPM Public | NPM Public | NPM Public |
| **Access** | public | public | public | public |
| **Publish Root** | `dist/` | `dist/` | `dist/` | `artifacts/algo-ts-testing/` |

#### Entry Points Configuration

**subscriber-ts:**
```json
{
  "main": "index.js",
  "module": "index.mjs",
  "types": "index.d.ts",
  "exports": {
    ".": { "types": "./index.d.ts", "import": "./index.mjs", "require": "./index.js" },
    "./block": { "types": "./block.d.ts", "import": "./block.mjs", "require": "./block.js" },
    "./transform": { "types": "./transform.d.ts", "import": "./transform.mjs", "require": "./transform.js" },
    "./types/*": { "types": "./*.d.ts", "import": "./*.mjs", "require": "./*.js" }
  }
}
```

**utils-ts:**
```json
{
  "main": "index.js",
  "module": "index.mjs",
  "types": "index.d.ts",
  "exports": {
    ".": { "types": "./index.d.ts", "import": "./index.mjs", "require": "./index.js" },
    "./abi": { ... },
    "./algo25": { ... },
    "./transact": { ... },
    "./algod-client": { ... },
    "./indexer-client": { ... },
    "./kmd-client": { ... },
    "./sdk": { ... }
  }
}
```

**utils-ts-debug:**
```json
{
  "main": "index.js",
  "module": "index.mjs",
  "types": "index.d.ts",
  "exports": {
    ".": { "types": "./index.d.ts", "import": "./index.mjs", "require": "./index.js" },
    "./types/*": { "types": "./*.d.ts", "import": "./*.mjs", "require": "./*.js" }
  }
}
```

**testing (ESM only):**
```json
{
  "main": "index.mjs",
  "types": "index.d.ts",
  "exports": {
    ".": { "types": "./index.d.ts", "import": "./index.mjs" },
    "./runtime-helpers": { ... },
    "./internal/*": { ... },
    "./test-transformer/jest-transformer": { ... },
    "./test-transformer/vitest-transformer": { ... },
    "./value-generators": { ... }
  }
}
```

### 3.2 Build Tooling Comparison

| Aspect | subscriber-ts | utils-ts | utils-ts-debug | testing |
|--------|---------------|----------|----------------|---------|
| **Bundler** | Rollup | **Rolldown** | Rollup | Rollup |
| **Output: CommonJS** | Yes (.js) | Yes (.js) | Yes (.js) | **No** |
| **Output: ESM** | Yes (.mjs) | Yes (.mjs) | Yes (.mjs) | Yes (.mjs) |
| **Output: Types** | Yes (.d.ts) | Yes (.d.ts) | Yes (.d.ts) | Yes (.d.ts) |
| **Sourcemaps** | Yes | Yes | Yes | Yes |
| **Tree Shaking** | Yes | Yes | Yes | Yes |

#### Build Scripts

**subscriber-ts, utils-ts-debug:**
```
build:0-clean      → Remove dist/coverage
build:1-compile    → Rollup compilation (CJS + ESM)
build:2-copy-pkg-json → Copy package.json with custom sections
build:3-copy-readme   → Copy README.md to dist
```

**utils-ts:**
```
build:0-clean      → Remove dist/coverage
build:1-compile    → Rolldown compilation (CJS + ESM)
build:2-copy-pkg-json → Copy package.json with custom sections
build:3-copy-readme   → Copy README.md to dist
```

**testing:**
```
build → Rollup compilation (ESM only) to dist/
```

### 3.3 Semantic Release Plugin Configuration

All repositories use the same four semantic-release plugins but with different configurations:

| Plugin | subscriber-ts | utils-ts | utils-ts-debug | testing |
|--------|---------------|----------|----------------|---------|
| **@semantic-release/commit-analyzer** | conventionalcommits | conventionalcommits | conventionalcommits | conventionalcommits |
| **@semantic-release/release-notes-generator** | conventionalcommits | conventionalcommits | conventionalcommits | conventionalcommits |
| **@semantic-release/npm** | pkgRoot: dist | pkgRoot: dist | pkgRoot: dist | **npmPublish: false** |
| **@semantic-release/github** | Yes | Yes | Yes | Yes |

#### NPM Publishing Approach

| Repository | Method | Details |
|------------|--------|---------|
| subscriber-ts | `@semantic-release/npm` | Publishes from `dist/` directory |
| utils-ts | `@semantic-release/npm` | Publishes from `dist/` directory |
| utils-ts-debug | `@semantic-release/npm` | Publishes from `dist/` directory |
| **testing** | **`JS-DevTools/npm-publish@v3`** | Separate action, not via semantic-release |

**testing NPM Publish Configuration:**
```yaml
- uses: JS-DevTools/npm-publish@v3
  with:
    token: ${{ secrets.NPM_TOKEN }}
    package: artifacts/algo-ts-testing/package.json
    tag: ${{ github.ref_name == 'alpha' && 'alpha' || github.ref_name == 'main' && 'beta' || 'latest' }}
```

### 3.4 Release Notes Generation

All repositories generate changelog sections from conventional commits:

| Section | Commit Types | subscriber-ts | utils-ts | utils-ts-debug | testing |
|---------|--------------|---------------|----------|----------------|---------|
| **Features** | `feat` | Yes | Yes | Yes | Yes |
| **Bug Fixes** | `fix` | Yes | Yes | Yes | Yes |
| **Dependencies and Other Build Updates** | `build`, `chore` | Yes | Yes | Yes | Yes |
| **Code Refactoring** | `refactor` | No | **Yes** | No | **Yes** |

### 3.5 NPM Registry Tags by Branch

| Branch | subscriber-ts | utils-ts | utils-ts-debug | testing |
|--------|---------------|----------|----------------|---------|
| **main** | `beta` | `beta` | `beta` | `beta` |
| **alpha** | `alpha` | - | `alpha` | `alpha` |
| **decoupling** | - | `alpha` | - | - |
| **release** | `latest` | `latest` | `latest` | `latest` |

### 3.6 Release Pipeline Flows

#### subscriber-ts, utils-ts-debug (Shared Workflow Pattern)

```
Push to main/release/alpha
        ↓
┌─────────────────────────────────────────┐
│ CI Job (makerxstudio/shared-config)     │
│  • Lint & commit lint                   │
│  • Run tests (with AlgoKit localnet)    │
│  • Security audit                       │
└─────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────┐
│ Docs Check Job                          │
│  • Generate TypeDoc                     │
│  • Verify docs are up-to-date           │
└─────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────┐
│ Build Job (makerxstudio/shared-config)  │
│  • Clean dist/                          │
│  • Compile with Rollup (CJS + ESM)      │
│  • Create package.zip artifact          │
└─────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────┐
│ Release Job (Node 22.x)                 │
│  • Download package.zip                 │
│  • Unzip to dist/                       │
│  • npx semantic-release                 │
│    ├─ Analyze commits                   │
│    ├─ Generate release notes            │
│    ├─ Publish to NPM (from dist/)       │
│    └─ Create GitHub release             │
└─────────────────────────────────────────┘
```

#### utils-ts (Custom Composite Action + Polytest)

```
Push to main/release/decoupling
        ↓
┌─────────────────────────────────────────┐
│ CI Job (.github/actions/ci)             │
│  • Setup Polytest                       │
│  • Start mock servers (algod, indexer)  │
│  • Lint & commit lint (range-based)     │
│  • Run tests with coverage              │
│  • Security audit                       │
└─────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────┐
│ Docs Check Job                          │
│  • Generate TypeDoc                     │
│  • Verify docs are up-to-date           │
└─────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────┐
│ Build Job (makerxstudio/shared-config)  │
│  • Clean dist/                          │
│  • Compile with Rolldown (CJS + ESM)    │
│  • Create package.zip artifact          │
└─────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────┐
│ Release Job (Node 20.x)                 │
│  • Download package.zip                 │
│  • Unzip to dist/                       │
│  • npx semantic-release                 │
│    ├─ Analyze commits                   │
│    ├─ Generate release notes            │
│    ├─ Publish to NPM (from dist/)       │
│    └─ Create GitHub release             │
└─────────────────────────────────────────┘
```

#### testing (Local Reusable Workflow + GitHub Pages)

```
Push to main/release/alpha
        ↓
┌─────────────────────────────────────────┐
│ CI Job (node-ci.yml reusable workflow)  │
│  • Lint & commit lint                   │
│  • Type checking                        │
│  • Run tests with CI reporter           │
│  • Security audit                       │
│  • Build with Rollup (ESM only)         │
│  • Upload dist/ artifact                │
└─────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────┐
│ Download Artifacts                      │
│  • Get algo-ts-testing artifact         │
│  • Place in artifacts/ directory        │
└─────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────┐
│ Semantic Release Job (Node 22.x)        │
│  • npx semantic-release                 │
│    ├─ Analyze commits                   │
│    ├─ Generate release notes            │
│    ├─ Create GitHub release             │
│    └─ (npmPublish: false)               │
└─────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────┐
│ NPM Publish Job (JS-DevTools action)    │
│  • Publish to NPM with tag:             │
│    • alpha branch → "alpha"             │
│    • main branch → "beta"               │
│    • release branch → "latest"          │
└─────────────────────────────────────────┘
        ↓ (release branch only)
┌─────────────────────────────────────────┐
│ GitHub Pages Deployment (gh-pages.yml)  │
│  • Generate TypeDoc HTML                │
│  • Upload pages artifact                │
│  • Deploy to GitHub Pages               │
└─────────────────────────────────────────┘
```

### 3.7 Production Release Workflow

All repositories have a manual `prod_release.yml` (or `prod-release.yml`) for promoting releases:

```
Manual workflow_dispatch trigger
        ↓
┌─────────────────────────────────────────┐
│ Generate GitHub App bot token           │
└─────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────┐
│ Merge main → release                    │
│  (triggers automatic release.yml)       │
└─────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────┐
│ Merge release → main [no ci]            │
│  (syncs version increment back)         │
└─────────────────────────────────────────┘
```

### 3.8 Bot Authentication

All repositories use GitHub App authentication for automated operations:

| Setting | Value |
|---------|-------|
| **Bot Name** | `engineering-ci[bot]` |
| **Bot Email** | `179917785+engineering-ci[bot]@users.noreply.github.com` |
| **Token Generation** | `actions/create-github-app-token@v1` |
| **App ID Secret** | `secrets.BOT_ID` |
| **Private Key Secret** | `secrets.BOT_SK` |

### 3.9 Documentation Deployment

| Repository | TypeDoc Output | GitHub Pages |
|------------|----------------|--------------|
| subscriber-ts | `docs/code/` (markdown) | No |
| utils-ts | `docs/` | No |
| utils-ts-debug | `docs/code/` (markdown) | No |
| **testing** | `docs/_html/` (HTML) | **Yes** |

**testing GitHub Pages Configuration:**
- **Workflow**: `gh-pages.yml` (called from release.yml on release branch)
- **Actions Used**: `actions/upload-pages-artifact@v3`, `actions/deploy-pages@v4`
- **TypeDoc Plugins**: `typedoc-plugin-missing-exports`, `typedoc-plugin-markdown`

---

## 4. Cross-Repository Comparison

### 4.1 Package Versions
| Package | subscriber-ts | utils-ts | utils-ts-debug | testing |
|---------|---------------|----------|----------------|---------|
| `semantic-release` | ^25.0.2 | ^24.1.2 | ^25.0.2 | ^24.2.9 |
| `@commitlint/cli` | ^19.2.1 | ^19.5.0 | ^20.2.0 | ^19.8.0 |
| `@commitlint/config-conventional` | ^19.1.0 | ^19.5.0 | ^20.2.0 | ^19.8.0 |
| `conventional-changelog-conventionalcommits` | ^7.0.2 | 8.0.0 | 9.1.0 | ^8.0.0 |

### 4.2 GitHub Actions Versions
| Action | subscriber-ts | utils-ts | utils-ts-debug | testing |
|--------|---------------|----------|----------------|---------|
| `actions/checkout` | v3, v4 | v3, v4 | v3 | v4 |
| `actions/setup-node` | v3 | v3, v4 | v3 | v4 |
| `actions/download-artifact` | v4 | v4 | v4 | v4 |
| `actions/create-github-app-token` | v1 | v1 | v1 | v1 |

### 4.3 Dependabot Configuration
| Setting | subscriber-ts | utils-ts | utils-ts-debug | testing |
|---------|---------------|----------|----------------|---------|
| **Enabled** | Yes | Yes | Yes | No |
| **Schedule** | Weekly | Weekly | Weekly | - |
| **Commit Prefix** | None | `chore(deps)` | `chore(deps)` | - |
| **Grouping** | None | All (minor+patch) | All (minor+patch) | - |

### 4.4 Semantic Release Rules
| Commit Type | subscriber-ts | utils-ts | utils-ts-debug | testing |
|-------------|---------------|----------|----------------|---------|
| `build` | patch | patch | patch | patch |
| `chore` | patch | patch | patch | patch |
| `refactor` | - | **patch** | - | **patch** |

### 4.5 Branch Strategy
| Branch | subscriber-ts | utils-ts | utils-ts-debug | testing |
|--------|---------------|----------|----------------|---------|
| **main** | beta prerelease | beta prerelease | beta prerelease | beta prerelease |
| **alpha/decoupling** | alpha | alpha (decoupling) | alpha | alpha |
| **release** | stable | stable | stable | stable |

### 4.6 Node.js for Semantic Release
| Repository | Node Version |
|------------|--------------|
| subscriber-ts | 22.x |
| utils-ts | 20.x |
| utils-ts-debug | 22.x |
| testing | 22.x |

### 4.7 Configuration Locations
| Config | subscriber-ts | utils-ts | utils-ts-debug | testing |
|--------|---------------|----------|----------------|---------|
| **Commitlint** | `commitlint.config.cjs` | `commitlint.config.cjs` | `commitlint.config.cjs` | `commitlint.config.cjs` |
| **Semantic Release** | `package.json` | `package.json` | `package.json` | `.releaserc.json` |

---

## 5. Key Inconsistencies

### 5.1 Package Version Drift
- **`semantic-release`**: utils-ts (^24.1.2) uses the oldest version, testing (^24.2.9) uses v24, subscriber-ts and utils-ts-debug use the newest (^25.0.2)
- **`@commitlint/*`**: Four different version ranges (^19.2.1, ^19.5.0, ^19.8.0, ^20.2.0)
- **`conventional-changelog-conventionalcommits`**: Four different versions (^7.0.2, 8.0.0, ^8.0.0, 9.1.0)

### 5.2 Dependabot Configuration
- **subscriber-ts**: Missing `chore(deps)` prefix and dependency grouping
- **utils-ts & utils-ts-debug**: Properly configured with prefix and grouping
- **testing**: Dependabot not configured at all

### 5.3 Semantic Release Rules
- **utils-ts & testing**: Include `refactor→patch` release rule
- **subscriber-ts & utils-ts-debug**: Only have `build` and `chore` rules

### 5.4 GitHub Actions Version Mix
- Mixed v3/v4 usage across repositories
- subscriber-ts and utils-ts-debug use mostly v3
- utils-ts uses v4 in PR workflow but v3 in release
- testing consistently uses v4

### 5.5 Branch Naming
- **utils-ts** uses `decoupling` instead of `alpha` for pre-release branch

### 5.6 Node.js for Release
- **utils-ts** uses Node 20.x for semantic-release
- **subscriber-ts, utils-ts-debug & testing** use Node 22.x

### 5.7 CI Architecture
- **subscriber-ts & utils-ts-debug**: Use makerxstudio shared workflow
- **utils-ts**: Uses custom local composite action with polytest integration
- **testing**: Uses local reusable workflow (node-ci.yml)

### 5.8 NPM Publishing Method
- **subscriber-ts, utils-ts, utils-ts-debug**: Use `@semantic-release/npm` plugin
- **testing**: Uses `JS-DevTools/npm-publish@v3` GitHub Action instead of semantic-release npm plugin
- This creates a different release flow where npm publish is a separate job rather than part of semantic-release

### 5.9 Build Output Format
- **subscriber-ts, utils-ts, utils-ts-debug**: Produce both CommonJS (.js) and ESM (.mjs) outputs
- **testing**: Produces **ESM only** (.mjs) - no CommonJS support
- This may cause compatibility issues for consumers using CommonJS

### 5.10 Bundler Tooling
- **subscriber-ts, utils-ts-debug, testing**: Use Rollup
- **utils-ts**: Uses **Rolldown** (Rust-based Rollup alternative)
- Different bundlers may produce subtly different outputs

### 5.11 Artifact Path Structure
- **subscriber-ts, utils-ts, utils-ts-debug**: Build to `dist/` and publish from `dist/`
- **testing**: Builds to `dist/` but publishes from `artifacts/algo-ts-testing/`
- Different artifact handling adds complexity

### 5.12 Semantic Release Configuration Location
- **subscriber-ts, utils-ts, utils-ts-debug**: Embed config in `package.json` under `"release"` key
- **testing**: Uses standalone `.releaserc.json` file
- Different locations make it harder to compare configurations

### 5.13 GitHub Pages Documentation
- **testing**: Has automated GitHub Pages deployment for documentation
- **subscriber-ts, utils-ts, utils-ts-debug**: No GitHub Pages deployment configured
- Documentation is less accessible for repos without Pages deployment

### 5.14 Coverage Thresholds
- **All repositories**: No minimum coverage requirements enforced
- **Impact**: Code coverage can degrade over time without CI failures

### 5.15 Action Pinning
- **All repositories**: All actions pinned to tags/branches, not commit SHAs
- **Impact**: Supply chain security vulnerability - tags can be moved or compromised

---

## 6. Recommendations

### 6.1 Standardize Package Versions
Align all repositories to the same versions:
```json
{
  "semantic-release": "^25.0.2",
  "@commitlint/cli": "^20.2.0",
  "@commitlint/config-conventional": "^20.2.0",
  "conventional-changelog-conventionalcommits": "9.1.0"
}
```

### 6.2 Standardize Dependabot Configuration
Apply to all repositories:
```yaml
version: 2
updates:
  - package-ecosystem: 'npm'
    directory: '/'
    schedule:
      interval: 'weekly'
    commit-message:
      prefix: 'chore(deps)'
    groups:
      all:
        patterns:
          - '*'
        update-types:
          - 'minor'
          - 'patch'
```

### 6.3 Standardize GitHub Actions Versions
Update all workflows to use latest stable versions:
- `actions/checkout@v4`
- `actions/setup-node@v4`
- `actions/download-artifact@v4`
- `actions/create-github-app-token@v1`

### 6.4 Standardize Semantic Release Rules
Decide whether `refactor→patch` should be standard across all repos.

### 6.5 Standardize Node.js Version
Use Node 22.x for semantic-release across all repositories (currently only utils-ts uses 20.x).

### 6.6 Standardize Branch Naming
Use consistent branch names (`alpha` vs `decoupling`).

### 6.7 Consider Unified CI Workflow
Create an algorandfoundation shared workflow that:
- Replaces makerxstudio dependency
- Includes optional polytest integration
- Provides consistent CI across all TS libraries

### 6.8 Standardize NPM Publishing Method
Use `@semantic-release/npm` consistently across all repositories instead of separate GitHub Actions:
- Simplifies the release pipeline
- Keeps NPM publish as part of the atomic semantic-release process
- Reduces potential for partial releases

### 6.9 Standardize Build Output Format
All repositories should produce both CommonJS and ESM outputs:
```
Output: CJS (.js) + ESM (.mjs) + Types (.d.ts)
```
This ensures maximum compatibility for consumers using different module systems.

### 6.10 Standardize Bundler
Choose either Rollup or Rolldown consistently:
- **Option A**: Use Rollup everywhere (more mature, widely used)
- **Option B**: Migrate to Rolldown everywhere (faster, newer)

### 6.11 Standardize Artifact Path Structure
Use consistent `dist/` directory for all repositories:
- Build output goes to `dist/`
- NPM publish from `dist/`
- Simplifies workflow configuration

### 6.12 Standardize Semantic Release Configuration Location
Choose one approach for all repositories:
- **Recommended**: Use standalone `.releaserc.json` files
- Benefits: Easier to compare, cleaner package.json, can use YAML format

### 6.13 Add GitHub Pages to All Repositories
Deploy documentation via GitHub Pages for all TypeScript libraries:
- Improves documentation discoverability
- Provides consistent API reference experience
- Use the pattern from algorand-typescript-testing

### 6.14 Add Coverage Thresholds
Enforce minimum coverage in all repositories:
```bash
jest --coverage --coverageThreshold='{"global":{"branches":80,"functions":80,"lines":80,"statements":80}}'
```
Or in `jest.config.js`:
```javascript
coverageThreshold: {
  global: {
    branches: 80,
    functions: 80,
    lines: 80,
    statements: 80
  }
}
```

### 6.15 Pin GitHub Actions to Commit SHAs
Update all workflow files to use immutable commit SHAs for supply chain security:
```yaml
# Instead of:
- uses: actions/checkout@v4
# Use:
- uses: actions/checkout@b4ffde65f46336ab88eb53be808477a3936bae11 # v4.1.1
```

---

## 7. Summary Matrix

| Feature | subscriber-ts | utils-ts | utils-ts-debug | testing |
|---------|:-------------:|:--------:|:--------------:|:-------:|
| Workflow Count | 3 | 3 | 3 | 5 |
| CI Pattern | Shared | Custom | Shared | Local reusable |
| Semantic Release | Yes | Yes | Yes | Yes |
| Conventional Commits | Yes | Yes | Yes | Yes |
| Dependabot Prefix | No | Yes | Yes | N/A |
| Dependabot Grouping | No | Yes | Yes | N/A |
| Actions v4 | Partial | Partial | No | Yes |
| Polytest | No | Yes | No | No |
| Issue Templates | Yes | Yes | Yes | Yes |
| PR Template | Yes | Yes | Yes | No |
| Coverage Thresholds | No | No | No | No |
| Actions Pinned to SHA | No | No | No | No |

### Release Strategy Summary

| Feature | subscriber-ts | utils-ts | utils-ts-debug | testing |
|---------|:-------------:|:--------:|:--------------:|:-------:|
| **NPM Publish Method** | semantic-release | semantic-release | semantic-release | **JS-DevTools** |
| **Build Output** | CJS + ESM | CJS + ESM | CJS + ESM | **ESM only** |
| **Bundler** | Rollup | **Rolldown** | Rollup | Rollup |
| **Release Config** | package.json | package.json | package.json | **.releaserc.json** |
| **Publish Root** | dist/ | dist/ | dist/ | **artifacts/** |
| **GitHub Pages** | No | No | No | **Yes** |
| **refactor→patch** | No | **Yes** | No | **Yes** |
| **Node for Release** | 22.x | **20.x** | 22.x | 22.x |

### NPM Package Details

| Package | subscriber-ts | utils-ts | utils-ts-debug | testing |
|---------|---------------|----------|----------------|---------|
| **Scope** | @algorandfoundation | @algorandfoundation | @algorandfoundation | @algorandfoundation |
| **Name** | algokit-subscriber | algokit-utils | algokit-utils-debug | algorand-typescript-testing |
| **Beta Tag** | main branch | main branch | main branch | main branch |
| **Alpha Tag** | alpha branch | decoupling branch | alpha branch | alpha branch |
| **Latest Tag** | release branch | release branch | release branch | release branch |
