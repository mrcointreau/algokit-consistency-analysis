# Repository Analysis: algokit-client-generator-ts

## 1. Repository Overview
- **Tech Stack**: Mixed (TypeScript + Python)
- **Purpose Category**: TypeScript CLI Tool
- **Monorepo**: No (single package with Python examples for testing)
- **Signal Files**:
  - [package.json](../../../algokit-client-generator-ts/package.json) - TypeScript package configuration, semantic-release config
  - [pyproject.toml](../../../algokit-client-generator-ts/pyproject.toml) - Python tooling for example smart contracts
  - [.github/workflows/pr.yml](../../../algokit-client-generator-ts/.github/workflows/pr.yml) - PR validation
  - [.github/workflows/release.yml](../../../algokit-client-generator-ts/.github/workflows/release.yml) - Release automation
  - [.github/workflows/prod_release.yml](../../../algokit-client-generator-ts/.github/workflows/prod_release.yml) - Production release workflow
  - [commitlint.config.cjs](../../../algokit-client-generator-ts/commitlint.config.cjs) - Commit message linting
  - [rollup.config.ts](../../../algokit-client-generator-ts/rollup.config.ts) - Build configuration
  - [bin/cli.mjs](../../../algokit-client-generator-ts/bin/cli.mjs) - CLI entry point
  - [docs/usage.md](../../../algokit-client-generator-ts/docs/usage.md) - User documentation
  - [docs/v4-migration.md](../../../algokit-client-generator-ts/docs/v4-migration.md) - Migration guide

---

## 2. CI/CD Findings

### 2.1 Workflow Inventory
| Workflow File | Purpose | Triggers |
|---------------|---------|----------|
| [pr.yml](../../../algokit-client-generator-ts/.github/workflows/pr.yml#L3-L7) | PR validation | pull_request on main (paths-ignore: **/*.md) |
| [release.yml](../../../algokit-client-generator-ts/.github/workflows/release.yml#L4-L8) | CD and Release | push to main, release branches; workflow_dispatch |
| [prod_release.yml](../../../algokit-client-generator-ts/.github/workflows/prod_release.yml#L4) | Production release | workflow_dispatch only |

### 2.2 Third-Party Actions
| Action | Version | Used In | Pinned |
|--------|---------|---------|--------|
| makerxstudio/shared-config/.github/workflows/node-ci.yml | @main | pr.yml, release.yml | **No** (branch ref) |
| makerxstudio/shared-config/.github/workflows/node-build-zip.yml | @main | release.yml | **No** (branch ref) |
| actions/create-github-app-token | @v1 | prod_release.yml, release.yml | **No** (tag ref) |
| actions/checkout | @v3 | prod_release.yml, release.yml | **No** (tag ref) |
| actions/setup-node | @v3 | release.yml | **No** (tag ref) |
| actions/download-artifact | @v4 | release.yml | **No** (tag ref) |
| devmasx/merge-branch | @854d3ac71ed1e9deb668e0074781b81fdd6e771f | prod_release.yml | **Yes** (commit SHA) |

**Reusable Workflow Actions** (from makerxstudio/shared-config@main):
| Action | Version | Used In | Pinned |
|--------|---------|---------|--------|
| actions/checkout | @v5 | node-ci.yml | **No** (tag ref) |
| actions/setup-node | @v6 | node-ci.yml, node-build-zip.yml | **No** (tag ref) |
| phoenix-actions/test-reporting | @v15 | node-ci.yml | **No** (tag ref) |
| actions/upload-artifact | @v5 | node-build-zip.yml | **No** (tag ref) |

**SECURITY FINDINGS**:
- **HIGH PRIORITY**: All third-party actions use tag-based or branch-based references, not commit SHAs (except devmasx/merge-branch)
- **CRITICAL**: Reusable workflows reference @main branch, creating supply chain vulnerability
- **RISK**: Version drift between actions/checkout (v3 in local workflows, v5 in reusable workflows)
- **RISK**: Version drift between actions/setup-node (v3 in local workflows, v6 in reusable workflows)
- Only 1 out of 10+ action references use immutable commit SHA pinning

### 2.3 Runtime Versions
- **Node Version**: 20.x (Source: hardcoded in workflows - Evidence: [pr.yml:17](../../../algokit-client-generator-ts/.github/workflows/pr.yml#L17), [release.yml:20](../../../algokit-client-generator-ts/.github/workflows/release.yml#L20), [release.yml:57](../../../algokit-client-generator-ts/.github/workflows/release.yml#L57))
- **Python Version**: ^3.12 (Source: [pyproject.toml:10](../../../algokit-client-generator-ts/pyproject.toml#L10) for example contracts only)
- **No .nvmrc or .python-version files** - version sources are split between workflow hardcoding and pyproject.toml
- **Node engines constraint**: >=20.0 (Source: [package.json:9](../../../algokit-client-generator-ts/package.json#L9))

### 2.4 Release Automation
- **Mechanism**: semantic-release (fully automated)
- **Triggers**: Automatic on push to main or release branches (Evidence: [release.yml:5-7](../../../algokit-client-generator-ts/.github/workflows/release.yml#L5-L7))
- **Configuration**: Inline in [package.json:99-157](../../../algokit-client-generator-ts/package.json#L99-L157)
- **Tag Format**: v{version} (inferred from git tags)
- **Publish Target**: npm (to @algorandfoundation scope)
- **Build Artifacts**: Built via rollup, packaged from dist/ directory
- **Production Release Process**: Manual workflow_dispatch triggers main→release→main merge cycle (Evidence: [prod_release.yml](../../../algokit-client-generator-ts/.github/workflows/prod_release.yml))

### 2.5 CI/CD Gaps & Anomalies
1. **Security**: Unpinned GitHub Actions (tag-based and branch-based refs) pose supply chain risk
2. **Inconsistency**: Action version drift between local workflows (v3) and reusable workflows (v5/v6)
3. **Complexity**: Three-way workflow split (PR, Release, Prod Release) with manual merge orchestration
4. **Dependency**: Heavy reliance on external reusable workflows (@main branch) introduces external dependency and version control issues
5. **No Coverage Enforcement**: Tests run with --coverage flag but no threshold enforcement visible in CI (Evidence: [package.json:43](../../../algokit-client-generator-ts/package.json#L43))

---

## 3. Branching Strategy Findings

### 3.1 Branch Triggers
| Workflow | Branches | Tags | Purpose |
|----------|----------|------|---------|
| pr.yml | main | - | PR validation before merge |
| release.yml | main, release | - | Continuous deployment and semantic-release |
| prod_release.yml | - | - | Manual workflow_dispatch to orchestrate release |

### 3.2 Commit Conventions
- **Commitlint**: Yes (Config: [@commitlint/config-conventional](../../../algokit-client-generator-ts/commitlint.config.cjs#L2))
- **Pre-commit Hooks**: No .pre-commit-config.yaml file found
- **Custom Rules**: Relaxed subject-case rules, allows longer headers/footers (Evidence: [commitlint.config.cjs:5-12](../../../algokit-client-generator-ts/commitlint.config.cjs#L5-L12))
- **CI Enforcement**: Yes, via reusable workflow with run-commit-lint: true (Evidence: [pr.yml:16](../../../algokit-client-generator-ts/.github/workflows/pr.yml#L16), [release.yml:21](../../../algokit-client-generator-ts/.github/workflows/release.yml#L21))

### 3.3 Release Branch Strategy
- **Semantic-Release Branches**:
  - main (with prerelease: "beta") - Evidence: [package.json:101-104](../../../algokit-client-generator-ts/package.json#L101-L104)
  - release (stable releases) - Evidence: [package.json:105-107](../../../algokit-client-generator-ts/package.json#L105-L107)
- **Environment Branches**: None
- **Other Branches**: alpha branch exists remotely but not in semantic-release config

### 3.4 Trunk-Based Compliance
- **Assessment**: Partially compliant (two-branch strategy)
- **Evidence**:
  - Main branch produces beta prereleases (Evidence: [package.json:103](../../../algokit-client-generator-ts/package.json#L103))
  - Release branch produces stable releases (Evidence: [package.json:106](../../../algokit-client-generator-ts/package.json#L106))
  - Manual promotion from main→release via prod_release.yml workflow
  - Git history shows regular "Merge release into main" and "Merge main into release" commits
- **Non-Trunk Pattern**: Uses main+release dual-branch strategy instead of single trunk with prerelease tags

---

## 4. Release & Versioning Findings

### 4.1 Release Mechanism
- **Tool**: semantic-release
- **Config File**: Inline in [package.json:99-157](../../../algokit-client-generator-ts/package.json#L99-L157)
- **Automation Level**: Fully automated (triggered by git pushes to main/release branches)

### 4.2 Tag Format
- **Format**: v{major}.{minor}.{patch}[-{prerelease}.{number}]
- **Examples**: v6.0.1-beta.4, v6.0.1, v5.0.1-beta.14
- **Source**: semantic-release default behavior (Evidence: git tag history)

### 4.3 Version Sources
| File | Field | Current Value | Role |
|------|-------|---------------|------|
| [package.json:3](../../../algokit-client-generator-ts/package.json#L3) | version | 0.0.0 | Placeholder (managed by semantic-release) |
| pyproject.toml:3 | version | 0.1.0 | Example contracts only (not published) |

### 4.4 Version Propagation
- **Auto-commit**: Yes (By: semantic-release during release job)
- **Lockfile Updates**: Automatic (package-lock.json committed by semantic-release)
- **Publish Directory**: dist/ (Evidence: [package.json:152](../../../algokit-client-generator-ts/package.json#L152) - pkgRoot: "dist")
- **Version Location**: Packaged package.json copied to dist/ (Evidence: [package.json:35](../../../algokit-client-generator-ts/package.json#L35))

### 4.5 Monorepo Version Strategy
- **N/A**: Not a monorepo (single package)
- **Note**: Python pyproject.toml exists only for example smart contract compilation, not for publishing

---

## 5. Testing Strategy Findings

### 5.1 Test Framework
- **Framework**: vitest
- **Config File**: No separate config file; uses vitest defaults (Evidence: [package.json:94](../../../algokit-client-generator-ts/package.json#L94))
- **Test Command**: vitest run (Evidence: [package.json:42](../../../algokit-client-generator-ts/package.json#L42))

### 5.2 Coverage Configuration
- **Tool**: Built-in vitest coverage (likely c8 or istanbul)
- **Thresholds**: None defined
- **Reporting**: Coverage generated but no enforcement (Evidence: [package.json:43](../../../algokit-client-generator-ts/package.json#L43) - test:ci uses --coverage flag)
- **Output**: coverage/ directory (cleaned in build:0-clean script)

### 5.3 Test Structure
- **Separation**: Mixed (approval tests + generated client tests)
- **File Patterns**: *.spec.ts
- **Test Files**:
  - [src/tests/approval-tests.spec.ts](../../../algokit-client-generator-ts/src/tests/approval-tests.spec.ts) - Main approval tests
  - examples/smart_contracts/artifacts/*/client.spec.ts - Generated client integration tests (8 files)
- **Test Approach**: Approval testing (comparing generated output against approved snapshots)
- **Total Test Files**: 9

### 5.4 CI Enforcement
- **Test Execution**: Yes (In workflows: pr.yml via node-ci reusable workflow, release.yml)
- **Coverage Enforcement**: No (Coverage collected but no threshold enforcement)
- **Pre-test Setup**: AlgoKit localnet started before tests (Evidence: [pr.yml:21-22](../../../algokit-client-generator-ts/.github/workflows/pr.yml#L21-L22))

### 5.5 Testing Gaps
1. **No coverage thresholds**: Coverage collected but not enforced
2. **No separate vitest config**: Relying on defaults, can't configure coverage thresholds
3. **Mixed test strategy**: Both unit-style approval tests and integration tests against localnet
4. **Python tests**: Python code in examples/ has pytest in dependencies but no visible test files for Python contracts

---

## 6. Documentation Findings

### 6.1 Documentation Tooling
- **Tool**: Manual markdown (no automated API doc generation)
- **Config File**: N/A
- **Location**: [docs/](../../../algokit-client-generator-ts/docs/) directory

### 6.2 Generation Settings
- **Theme**: N/A (manual documentation)
- **Extensions**: N/A
- **Entry Points**: N/A
- **Build Process**: None (static markdown files)

### 6.3 Publishing Automation
- **Hosting**: None (documentation embedded in GitHub repository)
- **Workflow**: None
- **Triggers**: N/A
- **README**: Comprehensive [README.md](../../../algokit-client-generator-ts/README.md) with usage examples

### 6.4 Documentation Structure
- **API Docs**: No (manual documentation in markdown)
- **Guides/Tutorials**: Yes ([docs/usage.md](../../../algokit-client-generator-ts/docs/usage.md))
- **Examples**: Yes (examples/ directory with smart contracts and generated clients)
- **Architecture Docs**: No
- **Migration Guides**: Yes ([docs/v4-migration.md](../../../algokit-client-generator-ts/docs/v4-migration.md))

### 6.5 Documentation Gaps
1. **No automated API documentation**: No TypeDoc or similar tool configured
2. **No documentation hosting**: No GitHub Pages, ReadTheDocs, or similar
3. **No documentation build process**: Documentation not validated or built in CI
4. **Manual maintenance**: Docs rely on manual updates, risk of staleness

---

## 7. Gaps, Risks, and Observations

### 7.1 Critical Gaps
1. **No coverage thresholds** (Evidence: [package.json:43](../../../algokit-client-generator-ts/package.json#L43) - coverage collected but not enforced)
   - Risk: Quality regression over time
   - Impact: Medium

2. **Unpinned GitHub Actions** (Evidence: [pr.yml:14](../../../algokit-client-generator-ts/.github/workflows/pr.yml#L14), [release.yml:18](../../../algokit-client-generator-ts/.github/workflows/release.yml#L18), [release.yml:50](../../../algokit-client-generator-ts/.github/workflows/release.yml#L50), etc.)
   - Risk: Supply chain attacks, unexpected behavior changes
   - Impact: High (security)

3. **Reusable workflows pinned to @main** (Evidence: [pr.yml:14](../../../algokit-client-generator-ts/.github/workflows/pr.yml#L14))
   - Risk: Breaking changes in shared workflows can break CI/CD
   - Impact: High (reliability)

4. **No vitest configuration file** (Evidence: missing vitest.config.ts)
   - Risk: Cannot configure coverage thresholds, reporters, or other test settings
   - Impact: Medium

### 7.2 Risks
1. **Complex branching strategy** (main+release with manual merge orchestration)
   - Evidence: [prod_release.yml](../../../algokit-client-generator-ts/.github/workflows/prod_release.yml), git history shows alternating merges
   - Impact: Medium (operational complexity, risk of merge conflicts)
   - Benefit: Allows beta testing on main before promoting to stable release

2. **Mixed tech stack** (TypeScript + Python)
   - Evidence: [package.json](../../../algokit-client-generator-ts/package.json), [pyproject.toml](../../../algokit-client-generator-ts/pyproject.toml)
   - Impact: Low (Python only used for example contract compilation)
   - Risk: Two separate dependency trees to maintain

3. **External dependency on makerxstudio/shared-config**
   - Evidence: [pr.yml:14](../../../algokit-client-generator-ts/.github/workflows/pr.yml#L14)
   - Impact: High (loss of control, external breaking changes)
   - Mitigation: Consider vendoring critical workflows or pinning to stable tags

4. **Action version inconsistency**
   - Evidence: actions/checkout@v3 in local workflows, @v5 in reusable workflows
   - Impact: Low (likely compatible, but indicates drift)

### 7.3 Standardization Opportunities
1. **Pin GitHub Actions to commit SHAs**
   - High security value
   - Standard practice for supply chain security
   - Low effort with Dependabot auto-updates

2. **Add vitest.config.ts with coverage thresholds**
   - Template: Standard vitest config with 80% coverage thresholds
   - Aligns with testing best practices
   - Medium effort

3. **Add TypeDoc for API documentation**
   - Benefit: Auto-generated docs from JSDoc comments
   - Standard practice for TypeScript libraries
   - Medium effort

4. **Consolidate to single .nvmrc file**
   - Removes hardcoded Node version from workflows
   - Single source of truth for Node version
   - Low effort

5. **Simplify branching strategy**
   - Consider: Single main branch with prerelease tags (trunk-based)
   - Trade-off: Loses separate beta/stable channels
   - High effort (requires release strategy rework)

### 7.4 Unique Patterns (Non-Issues)
1. **Python pyproject.toml in TypeScript CLI project**
   - Purpose: Example smart contract compilation using Puya
   - Valid: TypeScript client generator needs example contracts to test against
   - package-mode: false indicates no Python package publishing

2. **Approval testing approach**
   - Purpose: Ensures generated client code remains consistent
   - Valid: Appropriate for code generator testing
   - Evidence: [src/tests/approval-tests.spec.ts](../../../algokit-client-generator-ts/src/tests/approval-tests.spec.ts)

3. **Dual CLI entry points**
   - Purpose: Package name (@algorandfoundation/algokit-client-generator) and short alias (algokitgen)
   - Valid: Improves developer experience
   - Evidence: [package.json:49-52](../../../algokit-client-generator-ts/package.json#L49-L52)

4. **Rollup for bundling**
   - Purpose: Generates both CJS and ESM outputs
   - Valid: Supports both module systems
   - Evidence: [rollup.config.ts:8-24](../../../algokit-client-generator-ts/rollup.config.ts#L8-L24)

5. **Manual prod_release.yml workflow**
   - Purpose: Explicit control over main→release promotion
   - Valid: Ensures beta testing before stable release
   - Trade-off: More complex than single-branch strategy

---

## 8. Evidence Summary
- **Total Files Analyzed**: 20+
- **Key Evidence Files**:
  - [package.json:1-158](../../../algokit-client-generator-ts/package.json) (package config, scripts, semantic-release config, dependencies)
  - [pyproject.toml:1-52](../../../algokit-client-generator-ts/pyproject.toml) (Python tooling for examples)
  - [.github/workflows/pr.yml:1-23](../../../algokit-client-generator-ts/.github/workflows/pr.yml#L1-L23) (PR validation workflow)
  - [.github/workflows/release.yml:1-79](../../../algokit-client-generator-ts/.github/workflows/release.yml#L1-L79) (Release automation workflow)
  - [.github/workflows/prod_release.yml:1-43](../../../algokit-client-generator-ts/.github/workflows/prod_release.yml#L1-L43) (Production release orchestration)
  - [commitlint.config.cjs:1-15](../../../algokit-client-generator-ts/commitlint.config.cjs#L1-L15) (Commit convention enforcement)
  - [rollup.config.ts:1-46](../../../algokit-client-generator-ts/rollup.config.ts#L1-L46) (Build configuration)
  - [bin/cli.mjs:1-5](../../../algokit-client-generator-ts/bin/cli.mjs#L1-L5) (CLI entry point)
  - [src/index.ts:1-4](../../../algokit-client-generator-ts/src/index.ts#L1-L4) (Library exports)
  - [src/tests/approval-tests.spec.ts:1-50](../../../algokit-client-generator-ts/src/tests/approval-tests.spec.ts#L1-L50) (Test structure)
  - [docs/usage.md:1-50](../../../algokit-client-generator-ts/docs/usage.md#L1-L50) (User documentation)
  - [README.md:1-100](../../../algokit-client-generator-ts/README.md#L1-L100) (Project overview and quick start)
  - Git tags (version history evidence)
  - Git branches (branching strategy evidence)
