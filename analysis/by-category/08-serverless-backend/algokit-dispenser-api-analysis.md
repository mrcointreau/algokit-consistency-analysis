# Repository Analysis: algokit-dispenser-api

## 1. Repository Overview
- **Tech Stack**: TypeScript
- **Purpose Category**: Serverless Backend API (Category 8)
- **Monorepo**: Yes
  - `packages/core` - Core business logic and entities
  - `packages/functions` - Lambda function handlers
  - `stacks/` - SST infrastructure as code
- **Signal Files**:
  - [package.json](../../../algokit-dispenser-api/package.json) - Root package with semantic-release config
  - [pnpm-workspace.yaml](../../../algokit-dispenser-api/pnpm-workspace.yaml) - Workspace configuration
  - [sst.config.ts](../../../algokit-dispenser-api/sst.config.ts) - SST deployment configuration
  - [.github/workflows/pr.yaml](../../../algokit-dispenser-api/.github/workflows/pr.yaml) - PR validation workflow
  - [.github/workflows/release.yaml](../../../algokit-dispenser-api/.github/workflows/release.yaml) - Release and deployment workflow
  - [.github/actions/sst-build/action.yaml](../../../algokit-dispenser-api/.github/actions/sst-build/action.yaml) - Custom SST build action
  - [commitlint.config.ts](../../../algokit-dispenser-api/commitlint.config.ts) - Commit convention enforcement
  - [vitest.config.ts](../../../algokit-dispenser-api/vitest.config.ts) - Infrastructure test configuration
  - [vitest.config.unit.ts](../../../algokit-dispenser-api/vitest.config.unit.ts) - Unit test configuration
  - [tsconfig.json](../../../algokit-dispenser-api/tsconfig.json) - TypeScript configuration
  - [packages/core/package.json](../../../algokit-dispenser-api/packages/core/package.json) - Core package
  - [packages/functions/package.json](../../../algokit-dispenser-api/packages/functions/package.json) - Functions package

---

## 2. CI/CD Findings

### 2.1 Workflow Inventory
| Workflow File | Purpose | Triggers |
|---------------|---------|----------|
| [pr.yaml](../../../algokit-dispenser-api/.github/workflows/pr.yaml) | PR validation (lint, test, build) | pull_request on `main`, paths-ignore: `**/*.md` |
| [release.yaml](../../../algokit-dispenser-api/.github/workflows/release.yaml) | CI + Deploy to staging and prod | push to `main`, workflow_dispatch |

### 2.2 Third-Party Actions
| Action | Version | Used In | Pinned |
|--------|---------|---------|--------|
| actions/checkout | v4 | pr.yaml:53, release.yaml:55, release.yaml:85 | No (tag-based) |
| actions/setup-node | v4 | sst-build/action.yaml:27 | No (tag-based) |
| actions/setup-node | v6 | node-ci.yml (reusable) | No (tag-based) |
| aws-actions/configure-aws-credentials | v2 | sst-build/action.yaml:40 | No (tag-based) |
| makerxstudio/shared-config/.github/workflows/node-ci.yml | @main | pr.yaml:14, release.yaml:20 | No (branch-based) |
| phoenix-actions/test-reporting | v15 | node-ci.yml (reusable) | No (tag-based) |

**SECURITY FINDINGS**:
- **HIGH PRIORITY**: All actions are pinned to tags (v2, v4, v6) or branches (@main), NOT immutable commit SHAs
- **CRITICAL**: Reusable workflow `makerxstudio/shared-config/.github/workflows/node-ci.yml@main` is pinned to branch `@main`, creating supply chain risk as updates to that workflow will automatically affect this repo
- **SUPPLY CHAIN RISK**: Tag-based pinning (v4, v6, etc.) is vulnerable to tag force-pushing attacks. Recommended: Pin to full commit SHA with comments indicating version
- **RISK**: 6 distinct action references, none using commit SHA pinning

### 2.3 Runtime Versions
- **Node Version**: 22.x (Source: Multiple - hardcoded in workflows and action)
  - Evidence: [pr.yaml:19](../../../algokit-dispenser-api/.github/workflows/pr.yaml#L19) - `node-version: 22.x`
  - Evidence: [release.yaml:24](../../../algokit-dispenser-api/.github/workflows/release.yaml#L24) - `node-version: 22.x`
  - Evidence: [sst-build/action.yaml:29](../../../algokit-dispenser-api/.github/actions/sst-build/action.yaml#L29) - `node-version: 22.x`
  - Evidence: [package.json:52-53](../../../algokit-dispenser-api/package.json#L52-L53) - `engines.node: ">=22.0"`
  - Evidence: [sst.config.ts:17](../../../algokit-dispenser-api/sst.config.ts#L17) - `runtime: "nodejs22.x"`
- **Source of Truth**: Hardcoded in multiple locations; no `.nvmrc` or single source
- **Inconsistency**: Node version specified in 5 different files with slightly different formats (22.x vs >=22.0 vs nodejs22.x)

### 2.4 Release Automation
- **Mechanism**: Hybrid - Semantic-release configured but deployment is manual/environment-based
- **Deployment Strategy**: Multi-stage deployment (staging → production)
- **Triggers**:
  - Automatic staging deployment on push to `main`
  - Manual production deployment via `workflow_dispatch` with `is_prod_release` input
  - Evidence: [release.yaml:4-11](../../../algokit-dispenser-api/.github/workflows/release.yaml#L4-L11)
- **Semantic Release Config**: Configured in [package.json:54-106](../../../algokit-dispenser-api/package.json#L54-L106)
  - Uses `@semantic-release/commit-analyzer`, `@semantic-release/release-notes-generator`, `@semantic-release/github`
  - **FINDING**: Semantic-release is configured but NOT executed in any workflow (no step runs `npx semantic-release`)
  - **IMPLICATION**: Version bumps and GitHub releases are NOT automated despite configuration presence

### 2.5 CI/CD Gaps & Anomalies
1. **No automated semantic-release execution**: Config exists in [package.json:54-106](../../../algokit-dispenser-api/package.json#L54-L106) but no workflow step executes it
2. **Reusable workflow dependency**: Relies on external `makerxstudio/shared-config/.github/workflows/node-ci.yml@main` which creates external dependency
3. **Node version duplication**: Same version (22.x) hardcoded in 5 locations without single source of truth
4. **No coverage enforcement in CI**: Coverage collected via `--coverage` flag but no threshold enforcement visible
5. **Security: Unpinned actions**: All GitHub Actions use tag/branch refs instead of commit SHAs
6. **Missing changelog**: No CHANGELOG.md file despite semantic-release configuration
7. **Path ignores**: PR workflow ignores markdown changes, potentially allowing undocumented changes
8. **Environment-specific deployment**: Uses GitHub Environments (staging, prod) which is good practice
9. **Infrastructure tests run in staging but not prod**: Evidence: [release.yaml:62](../../../algokit-dispenser-api/release.yaml:62) shows `test: "true"` for staging, [release.yaml:93](../../../algokit-dispenser-api/release.yaml:93) shows `test: "false"` for prod

---

## 3. Branching Strategy Findings

### 3.1 Branch Triggers
| Workflow | Branches | Tags | Purpose |
|----------|----------|------|---------|
| pr.yaml | main (PR target) | N/A | PR validation on pull requests targeting main |
| release.yaml | main (push) | N/A | Deploy to staging on push to main, optional prod deploy via manual trigger |

### 3.2 Commit Conventions
- **Commitlint**: Yes (Config: [commitlint.config.ts](../../../algokit-dispenser-api/commitlint.config.ts))
  - Extends: `@commitlint/config-conventional`
  - Custom rules for subject case, max lengths
  - Evidence: [commitlint.config.ts:2](../../../algokit-dispenser-api/commitlint.config.ts#L2)
- **Pre-commit Hooks**: No `.pre-commit-config.yaml` found
- **CI Enforcement**: Yes, via reusable workflow
  - Evidence: [pr.yaml:17](../../../algokit-dispenser-api/.github/workflows/pr.yaml#L17) - `run-commit-lint: true`
  - Evidence: [release.yaml:23](../../../algokit-dispenser-api/.github/workflows/release.yaml#L23) - `run-commit-lint: true`

### 3.3 Release Branch Strategy
- **Semantic-Release Branches**: Configured but unused
  - Config shows: `[{name: "main", prerelease: "beta"}, {name: "release"}]`
  - Evidence: [package.json:55-63](../../../algokit-dispenser-api/package.json#L55-L63)
  - **FINDING**: Two-branch strategy configured (main → beta prereleases, release → stable) BUT semantic-release never executes
- **Environment Branches**: None - uses GitHub Environments instead
  - Staging environment: deploys from `main`
  - Prod environment: deploys from `main` with manual approval via workflow_dispatch

### 3.4 Trunk-Based Compliance
- **Assessment**: Partially compliant
- **Evidence**:
  - Uses `main` as primary branch for all releases
  - Configured for prerelease strategy (main=beta, release=stable) but not actively using release branch
  - Evidence: Remote branches show only `main` is active for releases, plus feature/fix branches
  - No long-lived development branches (no develop, release/*, hotfix/*)
  - **DEVIATION**: Semantic-release config suggests two-branch strategy but actual practice is trunk-based (main-only)
- **Pattern**: Trunk-based deployment with environment-based promotion (staging → prod)

---

## 4. Release & Versioning Findings

### 4.1 Release Mechanism
- **Tool**: Semantic-release (configured but not executed)
- **Config File**: Inline in [package.json:54-106](../../../algokit-dispenser-api/package.json#L54-L106) (no separate .releaserc.json)
- **Automation Level**: Manual (infrastructure deployment is automated, but versioning/tagging is not)
- **CRITICAL GAP**: Despite semantic-release configuration, no workflow step actually runs semantic-release
  - Searched all workflows for `semantic-release` or `npx semantic-release` - not found
  - Expected in release.yaml but absent

### 4.2 Tag Format
- **Format**: No tags found in repository (git tag returned empty)
- **Source**: Configured as default semantic-release format (would be `v1.2.3` based on conventional config)
- **Evidence**: No release tags exist despite repository having 20+ commits

### 4.3 Version Sources
| File | Field | Current Value | Role |
|------|-------|---------------|------|
| [package.json:3](../../../algokit-dispenser-api/package.json#L3) | version | 0.0.1 | Private root package (not published) |
| [packages/core/package.json:3](../../../algokit-dispenser-api/packages/core/package.json#L3) | version | 0.0.0 | Private package (not published) |
| [packages/functions/package.json:3](../../../algokit-dispenser-api/packages/functions/package.json#L3) | version | 0.0.0 | Private package (not published) |

**FINDING**: All packages marked as version `0.0.0` or `0.0.1` and `private: true`, indicating no npm publishing occurs

### 4.4 Version Propagation
- **Auto-commit**: Not applicable (semantic-release not executing)
- **Lockfile Updates**: package-lock.json committed to repository
  - Evidence: [package-lock.json](../../../algokit-dispenser-api/package-lock.json) exists and is tracked

### 4.5 Monorepo Version Strategy
- **Synchronization**: Not applicable - packages are internal-only, not published
- **Tool**: npm workspaces
  - Evidence: [package.json:48-50](../../../algokit-dispenser-api/package.json#L48-L50) - `workspaces: ["packages/*"]`
  - Evidence: [pnpm-workspace.yaml:1-2](../../../algokit-dispenser-api/pnpm-workspace.yaml#L1-L2) - `packages: ["packages/**/*"]`
- **INCONSISTENCY**: Root package.json declares npm workspaces but pnpm-workspace.yaml exists
  - Suggests pnpm may be intended but npm is actually used (package-lock.json present, not pnpm-lock.yaml)

---

## 5. Testing Strategy Findings

### 5.1 Test Framework
- **Framework**: Vitest
- **Config Files**:
  - [vitest.config.ts](../../../algokit-dispenser-api/vitest.config.ts) - Infrastructure tests (excludes packages)
  - [vitest.config.unit.ts](../../../algokit-dispenser-api/vitest.config.unit.ts) - Unit tests (excludes stacks, includes packages)

### 5.2 Coverage Configuration
- **Tool**: @vitest/coverage-v8 (Vitest's built-in coverage via V8)
  - Evidence: [package.json:27](../../../algokit-dispenser-api/package.json#L27)
- **Thresholds**: None configured in vitest configs
  - Evidence: Checked both [vitest.config.ts](../../../algokit-dispenser-api/vitest.config.ts) and [vitest.config.unit.ts](../../../algokit-dispenser-api/vitest.config.unit.ts) - no coverage thresholds
- **Reporting**: Coverage collected but no threshold enforcement
  - Evidence: [package.json:12](../../../algokit-dispenser-api/package.json#L12) - `test:unit` runs with `--coverage` flag
- **CI Execution**: Yes, coverage collected in CI
  - Evidence: [pr.yaml:23](../../../algokit-dispenser-api/.github/workflows/pr.yaml#L23) - `test-script: npm run test:unit`
  - Evidence: [release.yaml:30](../../../algokit-dispenser-api/.github/workflows/release.yaml#L30) - runs test:unit

### 5.3 Test Structure
- **Separation**: Mixed - Tests colocated with source files
  - Unit tests: `packages/core/src/**/*.test.ts`, `packages/functions/src/*.test.ts`
  - Infrastructure tests: `stacks/api.test.ts`
  - Total: 16 test files found
  - Evidence: ~1,695 lines of test code
- **File Patterns**: `*.test.ts` (consistent pattern across all packages)
- **Special Categories**:
  - Infrastructure tests (SST stack validation)
  - API tests (core business logic)
  - Lambda function tests

### 5.4 CI Enforcement
- **Test Execution**: Yes (In workflows: pr.yaml, release.yaml via reusable node-ci.yml)
- **Coverage Enforcement**: No - Coverage collected but no fail threshold
  - No `--coverage.lines`, `--coverage.branches` thresholds in [vitest.config.unit.ts](../../../algokit-dispenser-api/vitest.config.unit.ts)
  - No coverage gates in workflows
- **Matrix Testing**: No - Single Node version (22.x) tested
- **Pre-test Setup**: Requires AlgoKit localnet
  - Evidence: [pr.yaml:24-27](../../../algokit-dispenser-api/.github/workflows/pr.yaml#L24-L27) - starts localnet before tests

### 5.5 Testing Gaps
1. **No coverage thresholds**: Coverage collected but not enforced (no minimum percentages)
2. **No integration test automation**: README mentions `test:integration` but no CI execution
3. **No E2E tests visible**: Only unit and infrastructure tests found
4. **Single Node version**: No matrix testing across Node versions despite `engines.node: ">=22.0"` suggesting compatibility range
5. **No test reporting artifacts**: Tests run but results not published (reusable workflow has phoenix-actions/test-reporting but may not be configured)

---

## 6. Documentation Findings

### 6.1 Documentation Tooling
- **Tool**: Manual markdown (no TypeDoc, no automated API docs)
- **Config File**: N/A

### 6.2 Generation Settings
- **Theme**: N/A
- **Extensions**: N/A
- **Entry Points**: N/A
- **FINDING**: No automated documentation generation configured

### 6.3 Publishing Automation
- **Hosting**: None
- **Workflow**: None
- **Triggers**: N/A
- **FINDING**: No automated documentation publishing

### 6.4 Documentation Structure
- **API Docs**: No
- **Guides/Tutorials**: Yes
  - [README.md](../../../algokit-dispenser-api/README.md) - Setup, quick start, testing guide
  - [docs/README.md](../../../algokit-dispenser-api/docs/README.md) - Additional documentation
  - [docs/support.md](../../../algokit-dispenser-api/docs/support.md) - Support guide (16,799 bytes)
- **Examples**: Yes (in README)
- **Architecture Docs**: No (no ARCHITECTURE.md or design docs found)

### 6.5 Documentation Gaps
1. **No API documentation**: No TypeDoc or automated API reference
2. **No architecture documentation**: Missing ARCHITECTURE.md or design documentation
3. **No contributing guide**: No CONTRIBUTING.md found
4. **No changelog**: No CHANGELOG.md despite semantic-release config (would auto-generate if executed)
5. **Documentation not versioned**: Docs are static, not tied to releases
6. **No API schema documentation**: No OpenAPI/Swagger spec despite being an API service

---

## 7. Gaps, Risks, and Observations

### 7.1 Critical Gaps
1. **Semantic-release configured but never executed**
   - Evidence: [package.json:54-106](../../../algokit-dispenser-api/package.json#L54-L106) has full config
   - Evidence: No workflow step in [release.yaml](../../../algokit-dispenser-api/.github/workflows/release.yaml) runs `semantic-release`
   - **Impact**: No automated versioning, tagging, or GitHub releases despite infrastructure in place

2. **No coverage enforcement**
   - Evidence: [vitest.config.unit.ts](../../../algokit-dispenser-api/vitest.config.unit.ts) has no thresholds
   - Evidence: [package.json:12](../../../algokit-dispenser-api/package.json#L12) collects coverage but no fail-under
   - **Impact**: Code coverage can degrade without CI failures

3. **No release tags or versions**
   - Evidence: `git tag` returns empty
   - Evidence: All package versions at 0.0.0 or 0.0.1
   - **Impact**: No version history, difficult to track deployments

4. **Missing API documentation**
   - Evidence: No OpenAPI spec, no TypeDoc config
   - **Impact**: External consumers (AlgoKit CLI, web clients) lack formal API contract

### 7.2 Risks
1. **SECURITY - Supply chain: Unpinned GitHub Actions**
   - **Impact**: HIGH - Actions can be compromised or changed unexpectedly
   - **Evidence**: All actions use tag-based (@v4) or branch-based (@main) refs
   - **Affected**: 6 action references across 3 workflows
   - **Recommendation**: Pin all actions to commit SHA with version comments

2. **SECURITY - External reusable workflow on branch ref**
   - **Impact**: CRITICAL - `makerxstudio/shared-config/.github/workflows/node-ci.yml@main` can change without notice
   - **Evidence**: [pr.yaml:14](../../../algokit-dispenser-api/.github/workflows/pr.yaml#L14), [release.yaml:20](../../../algokit-dispenser-api/.github/workflows/release.yaml#L20)
   - **Risk**: MakerX Studio could modify workflow affecting all consuming repos
   - **Recommendation**: Pin to commit SHA or tag

3. **RELIABILITY - Node version duplication**
   - **Impact**: MEDIUM - Inconsistent updates could cause runtime mismatches
   - **Evidence**: Version 22.x in 5 locations (workflows, package.json engines, sst.config, action)
   - **Risk**: Updating one location but not others creates environment drift
   - **Recommendation**: Single source of truth (.nvmrc) read by all workflows

4. **MAINTAINABILITY - Workspace tool confusion**
   - **Impact**: LOW - Mixed signals on package manager
   - **Evidence**: [pnpm-workspace.yaml](../../../algokit-dispenser-api/pnpm-workspace.yaml) exists but [package-lock.json](../../../algokit-dispenser-api/package-lock.json) used
   - **Risk**: Developer confusion, potential for inconsistent installs
   - **Recommendation**: Remove pnpm-workspace.yaml or switch to pnpm fully

### 7.3 Standardization Opportunities
1. **Reusable SST deployment workflow**
   - Current: Custom composite action [.github/actions/sst-build](../../../algokit-dispenser-api/.github/actions/sst-build)
   - Opportunity: Could be extracted to shared MakerX config for other SST projects
   - Benefit: Consistency across SST-based serverless APIs

2. **Coverage threshold template**
   - Current: No thresholds
   - Opportunity: Establish standard thresholds (80% lines, 75% branches) for all AlgoKit repos
   - Benefit: Quality consistency across ecosystem

3. **Semantic-release execution pattern**
   - Current: Configured but unused
   - Opportunity: Either remove config or add execution step to standardize across repos
   - Benefit: Clear versioning strategy across ecosystem

4. **API documentation automation**
   - Current: None
   - Opportunity: TypeDoc + OpenAPI spec generation in CI
   - Benefit: Auto-generated, versioned API docs for consumers

5. **Node version source of truth**
   - Current: Hardcoded in 5 locations
   - Opportunity: .nvmrc file read by workflows via `node-version-file` parameter
   - Benefit: Single source of truth, easier updates

### 7.4 Unique Patterns (Non-Issues)
1. **Multi-stage deployment strategy** (staging → prod with manual gate)
   - Evidence: [release.yaml:37-93](../../../algokit-dispenser-api/.github/workflows/release.yaml#L37-L93)
   - Justification: Appropriate for production API requiring human approval
   - Pattern: GitHub Environments used correctly for approval workflows

2. **Infrastructure testing with SST bind**
   - Evidence: [package.json:14](../../../algokit-dispenser-api/package.json#L14) - `test:infra` uses `sst bind vitest`
   - Evidence: [vitest.config.ts](../../../algokit-dispenser-api/vitest.config.ts) excludes packages, focuses on stacks
   - Justification: Proper testing of infrastructure-as-code in serverless context

3. **Pre-test localnet requirement**
   - Evidence: [pr.yaml:24-27](../../../algokit-dispenser-api/.github/workflows/pr.yaml#L24-L27) starts AlgoKit localnet
   - Justification: API depends on Algorand blockchain, integration tests need real node
   - Pattern: Legitimate integration testing approach for blockchain applications

4. **Private packages with version 0.0.0**
   - Evidence: [packages/core/package.json:3](../../../algokit-dispenser-api/packages/core/package.json#L3), [packages/functions/package.json:3](../../../algokit-dispenser-api/packages/functions/package.json#L3)
   - Justification: Internal packages for monorepo, not published to npm
   - Pattern: Appropriate for Lambda-deployed code not distributed as library

5. **No traditional library documentation**
   - Justification: This is a deployed service (API), not a consumable library
   - Pattern: README-based documentation appropriate for infrastructure repos
   - Note: Still missing OpenAPI spec for API consumers

---

## 8. Evidence Summary
- **Total Files Analyzed**: 31
- **Key Evidence Files**:
  - [package.json:54-106](../../../algokit-dispenser-api/package.json#L54-L106) - Semantic-release config (unused)
  - [.github/workflows/release.yaml](../../../algokit-dispenser-api/.github/workflows/release.yaml) - Multi-stage deployment without semantic-release execution
  - [.github/actions/sst-build/action.yaml](../../../algokit-dispenser-api/.github/actions/sst-build/action.yaml) - Custom SST deployment action with unpinned actions
  - [commitlint.config.ts](../../../algokit-dispenser-api/commitlint.config.ts) - Commit convention enforcement
  - [vitest.config.unit.ts](../../../algokit-dispenser-api/vitest.config.unit.ts) - Test config without coverage thresholds
  - [sst.config.ts](../../../algokit-dispenser-api/sst.config.ts) - SST v2 serverless configuration
  - [pr.yaml:14](../../../algokit-dispenser-api/.github/workflows/pr.yaml#L14) - Reusable workflow on @main branch ref
  - [tsconfig.json](../../../algokit-dispenser-api/tsconfig.json) - TypeScript config extending @tsconfig/node22
  - [pnpm-workspace.yaml](../../../algokit-dispenser-api/pnpm-workspace.yaml) - Unused pnpm config (npm actually used)
  - Git tags: None found (empty)
  - Test files: 16 files, ~1,695 lines of test code
  - Documentation: README.md, docs/README.md, docs/support.md
  - No: CHANGELOG.md, ARCHITECTURE.md, CONTRIBUTING.md, .nvmrc, typedoc.json, OpenAPI spec
