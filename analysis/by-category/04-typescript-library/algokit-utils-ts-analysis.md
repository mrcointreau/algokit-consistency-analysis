# Repository Analysis: algokit-utils-ts

## 1. Repository Overview
- **Tech Stack**: TypeScript (with Python generator tool)
- **Purpose Category**: TypeScript Library
- **Monorepo**: Yes (9 workspace packages: algod_client, indexer_client, kmd_client, abi, testing, common, sdk, transact, algo25)
- **Signal Files**:
  - CI/CD: [.github/workflows/pr.yml](../../../algokit-utils-ts/.github/workflows/pr.yml), [.github/workflows/release.yml](../../../algokit-utils-ts/.github/workflows/release.yml), [.github/workflows/prod_release.yml](../../../algokit-utils-ts/.github/workflows/prod_release.yml), [.github/actions/ci/action.yml](../../../algokit-utils-ts/.github/actions/ci/action.yml)
  - Release: Inline config in [package.json:154-224](../../../algokit-utils-ts/package.json#L154-L224)
  - Versioning: [package.json:3](../../../algokit-utils-ts/package.json#L3), 9 workspace package.json files
  - Testing: [vitest.config.ts](../../../algokit-utils-ts/vitest.config.ts), package vitest configs
  - Documentation: [typedoc.json](../../../algokit-utils-ts/typedoc.json), [docs/](../../../algokit-utils-ts/docs/) directory
  - Commit Conventions: [commitlint.config.cjs](../../../algokit-utils-ts/commitlint.config.cjs)
  - Python Tool: [oas-generator/pyproject.toml](../../../algokit-utils-ts/oas-generator/pyproject.toml)

---

## 2. CI/CD Findings

### 2.1 Workflow Inventory
| Workflow File | Purpose | Triggers |
|---------------|---------|----------|
| [pr.yml](../../../algokit-utils-ts/.github/workflows/pr.yml) | PR validation | PRs to main, decoupling branches |
| [release.yml](../../../algokit-utils-ts/.github/workflows/release.yml) | CD/Release | Push to main, release, decoupling; manual workflow_dispatch |
| [prod_release.yml](../../../algokit-utils-ts/.github/workflows/prod_release.yml) | Production release | Manual workflow_dispatch only |

**Custom Actions**:
- [.github/actions/ci/action.yml](../../../algokit-utils-ts/.github/actions/ci/action.yml) - Reusable CI steps (setup, lint, test, build)

### 2.2 Third-Party Actions
| Action | Version | Used In | Pinned |
|--------|---------|---------|--------|
| actions/checkout | v4 | pr.yml:15, release.yml:23,74, prod_release.yml:20 | **No (tag)** |
| actions/checkout | v3 | release.yml:38 | **No (tag)** |
| actions/setup-node | v4 | pr.yml:35, ci/action.yml:21 | **No (tag)** |
| actions/setup-node | v3 | release.yml:85 | **No (tag)** |
| actions/create-github-app-token | v1 | release.yml:68, prod_release.yml:14 | **No (tag)** |
| actions/download-artifact | v4 | release.yml:90 | **No (tag)** |
| devmasx/merge-branch | 854d3ac71ed1e9deb668e0074781b81fdd6e771f | prod_release.yml:30,38 | **Yes (commit SHA)** |
| makerxstudio/shared-config/.github/workflows/node-build-zip.yml | @main | release.yml:53 | **No (branch ref)** |
| algorandfoundation/algokit-polytest/.github/actions/setup-polytest | @main | ci/action.yml:31 | **No (branch ref)** |
| algorandfoundation/algokit-polytest/.github/actions/run-mock-server | @main | ci/action.yml:64,69,74 | **No (branch ref)** |

**SECURITY FINDINGS**:
- **HIGH PRIORITY**: 9 out of 11 third-party actions pinned to tags (v1, v3, v4) instead of immutable commit SHAs - supply chain security risk
- **HIGH PRIORITY**: 2 reusable workflows/actions pinned to branch (@main) - can change without notice
- **INCONSISTENCY**: Mixed action versions (setup-node v3 and v4, checkout v3 and v4 across workflows)
- **POSITIVE**: devmasx/merge-branch correctly pinned to commit SHA

### 2.3 Runtime Versions
- **Node Version**: 20.x (Source: hardcoded in workflows [pr.yml:22](../../../algokit-utils-ts/pr.yml#L22), [release.yml:30,58,87](../../../algokit-utils-ts/release.yml#L30))
- **Node Version Constraint**: >=20.0 (Source: [package.json:9](../../../algokit-utils-ts/package.json#L9) engines field)
- **No .nvmrc file**: Version not tracked in version control file

### 2.4 Release Automation
- **Mechanism**: semantic-release (Evidence: [package.json:90,143,154-224](../../../algokit-utils-ts/package.json#L90))
- **Triggers**: Automatic on push to main/release/decoupling branches (Evidence: [release.yml:4-9](../../../algokit-utils-ts/release.yml#L4-L9))
- **Config**: Inline in package.json (Evidence: [package.json:154-224](../../../algokit-utils-ts/package.json#L154-L224))
- **Plugins**: @semantic-release/commit-analyzer, @semantic-release/release-notes-generator, @semantic-release/npm (publishes from dist/), @semantic-release/github
- **Custom Workflow**: [prod_release.yml](../../../algokit-utils-ts/prod_release.yml) for merging main → release → main

### 2.5 CI/CD Gaps & Anomalies
1. **Inconsistent action versions**: checkout@v3 and v4, setup-node@v3 and v4 mixed across workflows
2. **No version file**: Missing .nvmrc for Node version tracking
3. **Security**: Majority of actions not pinned to commit SHAs
4. **Reusable workflow security**: makerxstudio/shared-config pinned to @main branch
5. **Complex release flow**: prod_release.yml performs bidirectional branch merging (main → release → main)
6. **No caching strategy**: npm ci runs without leveraging GitHub Actions cache beyond setup-node's built-in cache

---

## 3. Branching Strategy Findings

### 3.1 Branch Triggers
| Workflow | Branches | Tags | Purpose |
|----------|----------|------|---------|
| pr.yml | main, decoupling | N/A | PR validation |
| release.yml | main, release, decoupling | N/A | Automated release on push |
| prod_release.yml | N/A (manual merge workflow) | N/A | Merges main → release for production |

### 3.2 Commit Conventions
- **Commitlint**: Yes (Evidence: [commitlint.config.cjs](../../../algokit-utils-ts/commitlint.config.cjs))
- **Config**: Extends @commitlint/config-conventional with custom rules
- **Enforcement**: In CI via [ci/action.yml:42-44](../../../algokit-utils-ts/ci/action.yml#L42-L44) - `npx commitlint --from ... --to ...`
- **Pre-commit Hooks**: No (no .pre-commit-config.yaml found)
- **Custom Rules**: Relaxed subject-case, type-empty, custom max lengths

### 3.3 Release Branch Strategy
- **Semantic-Release Branches**: (Evidence: [package.json:155-167](../../../algokit-utils-ts/package.json#L155-L167))
  - `main` (prerelease: beta)
  - `release` (stable releases)
  - `decoupling` (prerelease: alpha)
- **Environment Branches**: None (no preview/staging/production branches)
- **Multi-branch prerelease strategy**: Beta (main), Alpha (decoupling), Stable (release)

### 3.4 Trunk-Based Compliance
- **Assessment**: Partially compliant
- **Evidence**:
  - Uses main branch as beta prerelease channel (Evidence: [package.json:156-159](../../../algokit-utils-ts/package.json#L156-L159))
  - Separate `release` branch for stable production releases (Evidence: [package.json:161-163](../../../algokit-utils-ts/package.json#L161-L163))
  - `decoupling` branch for alpha prereleases (Evidence: [package.json:164-167](../../../algokit-utils-ts/package.json#L164-L167))
  - Manual promotion workflow from main → release (Evidence: [prod_release.yml](../../../algokit-utils-ts/prod_release.yml))
- **Pattern**: Git-flow-like with main as development/beta, release as stable, plus experimental alpha branch
- **Not fully trunk-based**: Requires manual promotion between branches, maintains long-lived release branch

---

## 4. Release & Versioning Findings

### 4.1 Release Mechanism
- **Tool**: semantic-release
- **Config File**: Inline in [package.json:154-224](../../../algokit-utils-ts/package.json#L154-L224)
- **Automation Level**: Fully automated (with manual promotion for production)
- **Conventional Commits**: Custom rules (Evidence: [package.json:171-186](../../../algokit-utils-ts/package.json#L171-L186)) - build, chore, refactor trigger patch releases

### 4.2 Tag Format
- **Format**: Not explicitly configured (defaults to v1.2.3 format)
- **Source**: semantic-release default behavior
- **Scope**: Single package (@algorandfoundation/algokit-utils published from dist/)

### 4.3 Version Sources
| File | Field | Current Value | Role |
|------|-------|---------------|------|
| [package.json:3](../../../algokit-utils-ts/package.json#L3) | version | 0.1.0 | Source of truth (managed by semantic-release) |
| [packages/*/package.json](../../../algokit-utils-ts/packages/) | version | 0.1.0 | Workspace packages (private, not published independently) |

**Note**: Main package published from dist/ with modified package.json (Evidence: [package.json:217-220](../../../algokit-utils-ts/package.json#L217-L220))

### 4.4 Version Propagation
- **Auto-commit**: Yes (By: semantic-release, via bot token)
- **Bot Authentication**: GitHub App token (Evidence: [release.yml:68-72](../../../algokit-utils-ts/release.yml#L68-L72))
- **Lockfile Updates**: Automatic (npm ci in CI, lockfile committed)
- **Distribution**: Build artifacts unzipped to dist/ before publishing (Evidence: [release.yml:95-99](../../../algokit-utils-ts/release.yml#L95-L99))

### 4.5 Monorepo Version Strategy
- **Synchronization**: All packages same version (0.1.0)
- **Tool**: npm workspaces (Evidence: [package.json:72-74](../../../algokit-utils-ts/package.json#L72-L74))
- **Publishing**: Only root package published (workspaces are private: true)
- **Internal Dependencies**: Packages reference each other (e.g., algod_client depends on @algorandfoundation/algokit-testing)
- **Unusual Pattern**: Workspace packages have `"private": true` but are built and bundled into main dist/ output

---

## 5. Testing Strategy Findings

### 5.1 Test Framework
- **Framework**: vitest
- **Config File**: [vitest.config.ts](../../../algokit-utils-ts/vitest.config.ts) (root) + per-package configs
- **Projects**: Configured for monorepo testing (Evidence: [vitest.config.ts:5](../../../algokit-utils-ts/vitest.config.ts#L5)) - `projects: ['.', 'packages/*']`

### 5.2 Coverage Configuration
- **Tool**: @vitest/coverage-v8 (Evidence: [package.json:126](../../../algokit-utils-ts/package.json#L126))
- **Thresholds**: **None configured** (Evidence: [vitest.config.ts:8-12](../../../algokit-utils-ts/vitest.config.ts#L8-L12))
- **Reporting**: text, html (Evidence: [vitest.config.ts:11](../../../algokit-utils-ts/vitest.config.ts#L11))
- **Include**: src/**/*.ts
- **Exclude**: tests/*.*
- **CI Flag**: `npm run test -- --silent` in CI (Evidence: [ci/action.yml:80](../../../algokit-utils-ts/ci/action.yml#L80))

### 5.3 Test Structure
- **Separation**: Mixed (tests/ directories and co-located .spec.ts files)
  - Root tests/ directory (Evidence: found via bash)
  - Co-located spec files: [src/**/*.spec.ts](../../../algokit-utils-ts/src/) (15 spec files found)
  - Package-level tests/: packages/algod_client/tests/, packages/indexer_client/tests/, packages/kmd_client/tests/, packages/transact/tests/
- **File Patterns**: *.spec.ts, *.test.ts (Evidence: [vitest.config.ts:6](../../../algokit-utils-ts/vitest.config.ts#L6))
- **Special Testing**: Polytest integration for API client testing against mock servers (Evidence: [ci/action.yml:30-76](../../../algokit-utils-ts/ci/action.yml#L30-L76))

### 5.4 CI Enforcement
- **Test Execution**: Yes (Evidence: [ci/action.yml:78-80](../../../algokit-utils-ts/ci/action.yml#L78-L80))
- **Coverage Enforcement**: **No** - No thresholds defined, no --cov-fail-under equivalent
- **Matrix Testing**: No (single Node version 20.x)
- **Integration Tests**: Yes - LocalNet started in CI (Evidence: [ci/action.yml:54-60](../../../algokit-utils-ts/ci/action.yml#L54-L60))
- **Mock Server Tests**: Yes - Polytest mock servers for algod/indexer/kmd (Evidence: [ci/action.yml:63-76](../../../algokit-utils-ts/ci/action.yml#L63-L76))

### 5.5 Testing Gaps
1. **No coverage thresholds**: Tests collect coverage but don't enforce minimum thresholds
2. **No matrix testing**: Only tests against Node 20.x, not multiple versions
3. **Mixed test structure**: Inconsistent placement (co-located vs tests/ dirs)
4. **No E2E separation**: Unit and integration tests not clearly separated

---

## 6. Documentation Findings

### 6.1 Documentation Tooling
- **Tool**: TypeDoc with markdown plugin
- **Config File**: [typedoc.json](../../../algokit-utils-ts/typedoc.json)

### 6.2 Generation Settings
- **Theme**: default (Evidence: [typedoc.json:8](../../../algokit-utils-ts/typedoc.json#L8))
- **Plugin**: typedoc-plugin-markdown (Evidence: [typedoc.json:7](../../../algokit-utils-ts/typedoc.json#L7))
- **Entry Points**: [src/index.ts, src/types/*.ts, src/testing/index.ts](../../../algokit-utils-ts/typedoc.json#L3)
- **Output Directory**: docs/code/ (Evidence: [typedoc.json:6](../../../algokit-utils-ts/typedoc.json#L6))
- **Git Revision**: main (Evidence: [typedoc.json:13](../../../algokit-utils-ts/typedoc.json#L13))
- **Build Command**: `npm run generate:code-docs` (Evidence: [package.json:91](../../../algokit-utils-ts/package.json#L91))

### 6.3 Publishing Automation
- **Hosting**: None (githubPages: false in config)
- **Workflow**: Docs validation only (Evidence: [pr.yml:26-46](../../../algokit-utils-ts/pr.yml#L26-L46), [release.yml:34-49](../../../algokit-utils-ts/release.yml#L34-L49))
- **Triggers**: Docs checked for staleness on PR and release (not published)
- **Enforcement**: CI fails if docs are out of date (Evidence: [pr.yml:39-46](../../../algokit-utils-ts/pr.yml#L39-L46) - `git diff --exit-code`)
- **Publishing**: Docs committed to repo, not published to external hosting

### 6.4 Documentation Structure
- **API Docs**: Yes - Auto-generated TypeDoc markdown in [docs/code/](../../../algokit-utils-ts/docs/code/)
- **Guides/Tutorials**: Yes - Manual guides in [docs/capabilities/](../../../algokit-utils-ts/docs/capabilities/) (14+ capability guides found)
- **Examples**: Embedded in guides
- **Architecture Docs**: No dedicated architecture documentation
- **Migration Guides**: Yes - [docs/v7-migration.md](../../../algokit-utils-ts/docs/v7-migration.md), [docs/v8-migration.md](../../../algokit-utils-ts/docs/v8-migration.md)
- **Main README**: [docs/README.md](../../../algokit-utils-ts/docs/README.md)

### 6.5 Documentation Gaps
1. **No external hosting**: Docs not published to GitHub Pages/ReadTheDocs/Netlify
2. **Manual sync required**: Docs must be regenerated and committed manually (enforced by CI check)
3. **No architecture docs**: No high-level architecture documentation
4. **Mixed location**: Auto-generated docs in docs/code/, manual docs in docs/capabilities/

---

## 7. Gaps, Risks, and Observations

### 7.1 Critical Gaps
1. **No coverage thresholds** (Evidence: [vitest.config.ts:8-12](../../../algokit-utils-ts/vitest.config.ts#L8-L12)) - Tests run but quality not enforced
2. **Unpinned GitHub Actions** (Evidence: all workflows) - 9/11 actions use tag-based refs, not commit SHAs
3. **No .nvmrc file** - Node version not tracked in version control
4. **Manual documentation sync** - Requires developers to remember to regenerate docs

### 7.2 Risks
1. **Supply Chain Security (HIGH)**: Tag-based action refs can be compromised; only devmasx/merge-branch uses commit SHA
2. **Branch Pinning Risk (HIGH)**: makerxstudio/shared-config and algokit-polytest actions pinned to @main branch
3. **Complex Release Flow (MEDIUM)**: prod_release.yml's bidirectional merge (main → release → main) could create conflicts
4. **Inconsistent Action Versions (MEDIUM)**: Using v3 and v4 of same actions across workflows
5. **No Coverage Enforcement (MEDIUM)**: Risk of quality degradation over time
6. **Monorepo Complexity (LOW)**: 9 internal packages with complex build orchestration

### 7.3 Standardization Opportunities
1. **Pin all actions to commit SHAs** - Update all workflows to use immutable refs
2. **Standardize action versions** - Use consistent versions (v4 for checkout/setup-node)
3. **Add .nvmrc file** - Track Node version in version control
4. **Add coverage thresholds** - Enforce minimum coverage (e.g., 80% lines)
5. **Publish docs automatically** - GitHub Pages deployment on release
6. **Separate config file** - Move semantic-release config from package.json to .releaserc.json
7. **Reusable workflow opportunity** - CI action could be converted to reusable workflow for consistency

### 7.4 Unique Patterns (Non-Issues)
1. **Monorepo with single publish**: Workspace packages are private but bundled into single published package - appropriate for this library structure
2. **Multi-branch prerelease strategy**: Beta (main), alpha (decoupling), stable (release) - supports active development while maintaining stability
3. **Polytest integration**: Mock server testing for deterministic API client tests - innovative testing approach
4. **Mixed Python/TypeScript**: Python OAS generator (oas-generator/) for TypeScript client generation - valid tooling choice
5. **Docs in repo**: Documentation committed rather than published externally - ensures version-specific docs always available
6. **Manual production promotion**: prod_release.yml workflow for controlled main → release promotion - appropriate for stability requirements

---

## 8. Evidence Summary
- **Total Files Analyzed**: 28 key files
- **Key Evidence Files**:
  - [package.json:1-226](../../../algokit-utils-ts/package.json) (for version, scripts, semantic-release config, workspaces, dependencies)
  - [.github/workflows/pr.yml:1-47](../../../algokit-utils-ts/pr.yml) (for PR validation triggers and actions)
  - [.github/workflows/release.yml:1-109](../../../algokit-utils-ts/release.yml) (for release automation and branch strategy)
  - [.github/workflows/prod_release.yml:1-45](../../../algokit-utils-ts/prod_release.yml) (for production release process)
  - [.github/actions/ci/action.yml:1-89](../../../algokit-utils-ts/ci/action.yml) (for CI steps and third-party actions)
  - [vitest.config.ts:1-27](../../../algokit-utils-ts/vitest.config.ts) (for test configuration and coverage settings)
  - [typedoc.json:1-14](../../../algokit-utils-ts/typedoc.json) (for documentation generation)
  - [commitlint.config.cjs:1-14](../../../algokit-utils-ts/commitlint.config.cjs) (for commit conventions)
  - [oas-generator/pyproject.toml:1-23](../../../algokit-utils-ts/oas-generator/pyproject.toml) (for Python tooling)
  - [9 workspace package.json files](../../../algokit-utils-ts/packages/) (for monorepo structure)

### Workflow Analysis
- 3 workflow files analyzed
- 1 custom composite action
- 11 distinct third-party action references
- 2 external reusable workflows/actions from algokit-polytest
- 1 external reusable workflow from makerxstudio/shared-config

### Testing Evidence
- 15 co-located .spec.ts files in src/
- 4 package test directories (algod_client, indexer_client, kmd_client, transact)
- Polytest configuration for mock server testing
- LocalNet integration testing

### Documentation Evidence
- TypeDoc markdown generation
- 14+ capability guides in docs/capabilities/
- 2 migration guides
- Auto-generated API docs in docs/code/
- CI enforcement of doc freshness
