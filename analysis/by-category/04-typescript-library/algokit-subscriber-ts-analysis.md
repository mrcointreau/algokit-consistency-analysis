# Repository Analysis: algokit-subscriber-ts

## 1. Repository Overview
- **Tech Stack**: TypeScript
- **Purpose Category**: TypeScript Library (Category 4)
- **Monorepo**: No (single package library with test contract subdirectory)
- **Signal Files**:
  - CI/CD: [.github/workflows/pr.yml](../../../algokit-subscriber-ts/.github/workflows/pr.yml), [.github/workflows/release.yml](../../../algokit-subscriber-ts/.github/workflows/release.yml), [.github/workflows/prod_release.yml](../../../algokit-subscriber-ts/.github/workflows/prod_release.yml)
  - Release: [package.json](../../../algokit-subscriber-ts/package.json) (semantic-release config embedded, lines 112-170)
  - Versioning: [package.json](../../../algokit-subscriber-ts/package.json)
  - Testing: [vitest.config.ts](../../../algokit-subscriber-ts/vitest.config.ts), [tests/](../../../algokit-subscriber-ts/tests/)
  - Documentation: [typedoc.json](../../../algokit-subscriber-ts/typedoc.json), [docs/](../../../algokit-subscriber-ts/docs/)
  - Commit Conventions: [commitlint.config.cjs](../../../algokit-subscriber-ts/commitlint.config.cjs)
  - Dependency Management: [.github/dependabot.yml](../../../algokit-subscriber-ts/.github/dependabot.yml)
  - Build: [rollup.config.ts](../../../algokit-subscriber-ts/rollup.config.ts), [tsconfig.build.json](../../../algokit-subscriber-ts/tsconfig.build.json)

---

## 2. CI/CD Findings

### 2.1 Workflow Inventory
| Workflow File | Purpose | Triggers |
|---------------|---------|----------|
| [pr.yml](../../../algokit-subscriber-ts/.github/workflows/pr.yml) | PR validation, tests, docs check | pull_request to main |
| [release.yml](../../../algokit-subscriber-ts/.github/workflows/release.yml) | CI, build, and automated release | push to main/release, workflow_dispatch |
| [prod_release.yml](../../../algokit-subscriber-ts/.github/workflows/prod_release.yml) | Production release (branch merge) | workflow_dispatch (manual) |

### 2.2 Third-Party Actions

**Direct Actions in Repository Workflows:**
| Action | Version | Used In | Pinned |
|--------|---------|---------|--------|
| makerxstudio/shared-config/.github/workflows/node-ci.yml | @main | pr.yml, release.yml | No (branch ref) |
| makerxstudio/shared-config/.github/workflows/node-build-zip.yml | @main | release.yml | No (branch ref) |
| actions/checkout | v3 | pr.yml, release.yml | Partial (tag) |
| actions/checkout | v4 | release.yml, prod_release.yml | Partial (tag) |
| actions/create-github-app-token | v1 | release.yml, prod_release.yml | Partial (tag) |
| actions/setup-node | v3 | release.yml | Partial (tag) |
| actions/download-artifact | v4 | release.yml | Partial (tag) |
| devmasx/merge-branch | 854d3ac71ed1e9deb668e0074781b81fdd6e771f | prod_release.yml | Yes (commit SHA) |

**Actions Used in Reusable Workflows (makerxstudio/shared-config):**
| Action | Version | Used In | Pinned |
|--------|---------|---------|--------|
| actions/checkout | v5 | node-ci.yml, node-build-zip.yml | Partial (tag) |
| actions/setup-node | v6 | node-ci.yml, node-build-zip.yml | Partial (tag) |
| actions/upload-artifact | v5 | node-build-zip.yml | Partial (tag) |
| phoenix-actions/test-reporting | v15 | node-ci.yml | Partial (tag) |

**SECURITY FINDINGS**:
- **HIGH PRIORITY**: Reusable workflows pinned to branch (@main) instead of immutable ref (Evidence: [.github/workflows/pr.yml:13](../../../algokit-subscriber-ts/.github/workflows/pr.yml#L13), [.github/workflows/release.yml:15](../../../algokit-subscriber-ts/.github/workflows/release.yml#L15), [.github/workflows/release.yml:45](../../../algokit-subscriber-ts/.github/workflows/release.yml#L45))
- **MEDIUM PRIORITY**: Most GitHub Actions pinned to tags (v3, v4, v5, v6) instead of commit SHAs, creating supply chain risk
- **POSITIVE**: devmasx/merge-branch correctly pinned to commit SHA (Evidence: [.github/workflows/prod_release.yml:30](../../../algokit-subscriber-ts/.github/workflows/prod_release.yml#L30))
- **RISK**: Inconsistent action versions (checkout v3 vs v4) across workflows

### 2.3 Runtime Versions
- **Node Version**: 22.x (Source: hardcoded in workflows - [.github/workflows/pr.yml:15](../../../algokit-subscriber-ts/.github/workflows/pr.yml#L15), [.github/workflows/release.yml:17](../../../algokit-subscriber-ts/.github/workflows/release.yml#L17), [.github/workflows/release.yml:78](../../../algokit-subscriber-ts/.github/workflows/release.yml#L78))
- **Python Version**: Not applicable (Python only used for test contract, managed via pipx/algokit)
- **Node Version File**: None found (no .nvmrc or .node-version)
- **Package Engines**: >=18.0 (Evidence: [package.json:34-36](../../../algokit-subscriber-ts/package.json#L34-L36))
- **INCONSISTENCY**: Workflow uses Node 22.x but package.json engines specifies >=18.0

### 2.4 Release Automation
- **Mechanism**: semantic-release (fully automated)
- **Triggers**: Automatic on push to main or release branches (Evidence: [.github/workflows/release.yml:4-8](../../../algokit-subscriber-ts/.github/workflows/release.yml#L4-L8))
- **Config Location**: Embedded in package.json (Evidence: [package.json:112-170](../../../algokit-subscriber-ts/package.json#L112-L170))
- **Release Branches**: main (beta prerelease), release (production)
- **Tag Format**: Standard semantic versioning (implied from semantic-release)
- **Publish Target**: npm (to @algorandfoundation scope, Evidence: [package.json:2](../../../algokit-subscriber-ts/package.json#L2))
- **Build Artifact**: Built package in dist/ directory uploaded and published (Evidence: [.github/workflows/release.yml:51](../../../algokit-subscriber-ts/.github/workflows/release.yml#L51))

### 2.5 CI/CD Gaps & Anomalies
1. **Reusable workflow dependency**: Heavy reliance on external makerxstudio/shared-config workflows creates external dependency risk
2. **No version pinning for reusable workflows**: @main branch references instead of tags or SHAs
3. **Inconsistent checkout versions**: Mix of v3 and v4 across workflows
4. **No explicit coverage enforcement**: Tests run with coverage but no fail threshold visible in workflows
5. **Dual-branch release strategy**: Complexity with main (beta) and release (production) branches requiring manual prod_release workflow
6. **GitHub App token dependency**: Requires secrets.BOT_ID and secrets.BOT_SK for releases

---

## 3. Branching Strategy Findings

### 3.1 Branch Triggers
| Workflow | Branches | Tags | Purpose |
|----------|----------|------|---------|
| pr.yml | main (PR target) | N/A | PR validation, tests, docs check |
| release.yml | main, release (push) | N/A | CI, build, automated release |
| prod_release.yml | N/A (manual) | N/A | Merge main→release→main for production |

### 3.2 Commit Conventions
- **Commitlint**: Yes (Config: @commitlint/config-conventional with custom rules)
- **Config File**: [commitlint.config.cjs](../../../algokit-subscriber-ts/commitlint.config.cjs)
- **Pre-commit Hooks**: No (.pre-commit-config.yaml not found)
- **Custom Rules**: Relaxed subject-case (pascal/upper allowed), relaxed body/footer lengths (Evidence: [commitlint.config.cjs:5-13](../../../algokit-subscriber-ts/commitlint.config.cjs#L5-L13))
- **Enforcement**: In CI via reusable workflow with run-commit-lint: true (Evidence: [.github/workflows/pr.yml:17](../../../algokit-subscriber-ts/.github/workflows/pr.yml#L17))
- **Package.json script**: commit-lint script available (Evidence: [package.json:18](../../../algokit-subscriber-ts/package.json#L18))

### 3.3 Release Branch Strategy
- **Semantic-Release Branches**:
  - main (prerelease: beta) - Evidence: [package.json:114-117](../../../algokit-subscriber-ts/package.json#L114-L117)
  - release (production) - Evidence: [package.json:118-121](../../../algokit-subscriber-ts/package.json#L118-L121)
- **Branch Workflow**: Main produces beta releases, release branch produces stable releases
- **Production Promotion**: Manual workflow_dispatch of prod_release.yml merges main→release→main (Evidence: [.github/workflows/prod_release.yml:29-43](../../../algokit-subscriber-ts/.github/workflows/prod_release.yml#L29-L43))
- **Environment Branches**: None (no separate staging/preview branches)

### 3.4 Trunk-Based Compliance
- **Assessment**: Partially compliant
- **Evidence**:
  - Uses main as primary development branch
  - Has additional long-lived release branch for production releases
  - Main branch produces beta prereleases
  - Release branch produces stable releases
  - Not fully trunk-based due to dual-branch release strategy
  - No long-lived feature branches visible in workflow config

---

## 4. Release & Versioning Findings

### 4.1 Release Mechanism
- **Tool**: semantic-release v25.0.2
- **Config File**: Embedded in package.json under "release" key (Evidence: [package.json:112-170](../../../algokit-subscriber-ts/package.json#L112-L170))
- **Automation Level**: Fully automated (CI triggers on push to main/release)
- **Preset**: conventionalcommits
- **Custom Release Rules**:
  - build type triggers patch release (Evidence: [package.json:129-131](../../../algokit-subscriber-ts/package.json#L129-L131))
  - chore type triggers patch release (Evidence: [package.json:132-135](../../../algokit-subscriber-ts/package.json#L132-L135))

### 4.2 Tag Format
- **Format**: Standard semantic versioning (v1.2.3 implied by semantic-release defaults)
- **Source**: semantic-release automatic tagging
- **Prerelease Tags**: Beta tags on main branch (Evidence: [package.json:116](../../../algokit-subscriber-ts/package.json#L116))

### 4.3 Version Sources
| File | Field | Current Value | Role |
|------|-------|---------------|------|
| [package.json](../../../algokit-subscriber-ts/package.json) | version | 1.0.0 | Source of truth (managed by semantic-release) |

**Note**: No __version__ export in TypeScript source (not a standard pattern for TS)

### 4.4 Version Propagation
- **Auto-commit**: Yes (By: semantic-release)
- **Lockfile Updates**: Automatic (package-lock.json committed)
- **Build Artifacts**: Version propagated to dist/package.json (Evidence: [package.json:9](../../../algokit-subscriber-ts/package.json#L9) - copy-package-json step)
- **Publish from**: dist/ directory (Evidence: [package.json:165](../../../algokit-subscriber-ts/package.json#L165) - pkgRoot: "dist")

### 4.5 Monorepo Version Strategy (if applicable)
- **N/A**: Not a monorepo
- **Note**: tests/contract/pyproject.toml is a test fixture, not a distributed package

---

## 5. Testing Strategy Findings

### 5.1 Test Framework
- **Framework**: vitest v3.2.4
- **Config File**: [vitest.config.ts](../../../algokit-subscriber-ts/vitest.config.ts)
- **Test Pattern**: `**/*.spec.ts` (Evidence: [vitest.config.ts:6](../../../algokit-subscriber-ts/vitest.config.ts#L6))
- **Setup File**: tests/setup.ts (Evidence: [vitest.config.ts:10](../../../algokit-subscriber-ts/vitest.config.ts#L10))

### 5.2 Coverage Configuration
- **Tool**: @vitest/coverage-v8 (v3.2.4)
- **Include**: src/**/*.ts (Evidence: [vitest.config.ts:12](../../../algokit-subscriber-ts/vitest.config.ts#L12))
- **Exclude**: src/types/*.* (Evidence: [vitest.config.ts:13](../../../algokit-subscriber-ts/vitest.config.ts#L13))
- **Reporters**: text, html (Evidence: [vitest.config.ts:14](../../../algokit-subscriber-ts/vitest.config.ts#L14))
- **Thresholds**: **NONE** - No coverage thresholds configured
- **CI Flag**: --coverage flag used in test script (Evidence: [package.json:11](../../../algokit-subscriber-ts/package.json#L11))

### 5.3 Test Structure
- **Separation**: Tests organized in tests/scenarios/ directory
- **Test Count**: 18 spec files
- **Categories**:
  - Transaction filtering tests (filters.spec.ts, app-call-transactions.spec.ts, balance-changes.spec.ts)
  - Sync behavior tests (catchup-with-indexer.spec.ts, skip-sync-newest.spec.ts, sync-oldest.spec.ts)
  - Transform tests (transform-*.spec.ts - 6 files)
  - Event tests (events.spec.ts)
  - Error handling (fail.spec.ts)
  - Subscriber behavior (subscriber.spec.ts, multiple-filters.spec.ts)
- **Test Fixtures**: Shared fixtures in tests/ (filterFixture.ts, transactions.ts, testing-app.ts, etc.)
- **Test Timeout**: 20,000ms (Evidence: [vitest.config.ts:9](../../../algokit-subscriber-ts/vitest.config.ts#L9))
- **Test Infrastructure**: Requires AlgoKit LocalNet (Evidence: [.github/workflows/pr.yml:20-22](../../../algokit-subscriber-ts/.github/workflows/pr.yml#L20-L22))

### 5.4 CI Enforcement
- **Test Execution**: Yes (In workflow: node-ci.yml via pr.yml and release.yml)
- **Coverage Enforcement**: No - coverage collected but no threshold enforcement
- **Pre-test Setup**: AlgoKit localnet start + wait for port 4001 (Evidence: [.github/workflows/pr.yml:19-22](../../../algokit-subscriber-ts/.github/workflows/pr.yml#L19-L22))
- **Test Environment**: LocalNet algod/indexer via environment variables (Evidence: [vitest.config.ts:19-27](../../../algokit-subscriber-ts/vitest.config.ts#L19-L27))

### 5.5 Testing Gaps
1. **No coverage thresholds**: Coverage collected but not enforced with minimum thresholds
2. **No coverage reporting to PRs**: No visible coverage comment bot or PR decoration
3. **Integration test dependency**: Tests require full AlgoKit LocalNet, making them slow and infrastructure-dependent
4. **No unit vs integration separation**: All tests appear to be integration tests against live chain

---

## 6. Documentation Findings

### 6.1 Documentation Tooling
- **Tool**: TypeDoc v0.25.4 with typedoc-plugin-markdown v3.17.1
- **Config File**: [typedoc.json](../../../algokit-subscriber-ts/typedoc.json)
- **Output Format**: Markdown (for docs/code/)

### 6.2 Generation Settings
- **Entry Points**: src/index.ts, src/types/*.ts (Evidence: [typedoc.json:3](../../../algokit-subscriber-ts/typedoc.json#L3))
- **Strategy**: expand (Evidence: [typedoc.json:5](../../../algokit-subscriber-ts/typedoc.json#L5))
- **Output Directory**: docs/code (Evidence: [typedoc.json:6](../../../algokit-subscriber-ts/typedoc.json#L6))
- **Theme**: default (Evidence: [typedoc.json:8](../../../algokit-subscriber-ts/typedoc.json#L8))
- **Plugin**: typedoc-plugin-markdown (Evidence: [typedoc.json:7](../../../algokit-subscriber-ts/typedoc.json#L7))
- **TSConfig**: tsconfig.build.json (Evidence: [typedoc.json:14](../../../algokit-subscriber-ts/typedoc.json#L14))
- **Git Revision**: main (Evidence: [typedoc.json:13](../../../algokit-subscriber-ts/typedoc.json#L13))

### 6.3 Publishing Automation
- **Hosting**: None (GitHub Pages not enabled)
- **Workflow**: No dedicated docs publishing workflow
- **Docs Validation**: check_docs job ensures docs are up-to-date in CI (Evidence: [.github/workflows/pr.yml:25-40](../../../algokit-subscriber-ts/.github/workflows/pr.yml#L25-L40), [.github/workflows/release.yml:26-41](../../../algokit-subscriber-ts/.github/workflows/release.yml#L26-L41))
- **Enforcement**: Docs must be committed to repository (checked via git diff)
- **Distribution**: Docs distributed via npm package and GitHub repository

### 6.4 Documentation Structure
- **API Docs**: Yes - Auto-generated in docs/code/ (Evidence: docs/code/README.md)
- **Guides/Tutorials**: Yes - Manual guides in docs/ (Evidence: docs/README.md, docs/subscriber.md, docs/subscriptions.md)
- **Examples**: Yes - Code examples in examples/ (data-history-museum, usdc, xgov-voting)
- **Migration Guides**: Yes - v3-migration.md (Evidence: docs/v3-migration.md)
- **Architecture Docs**: Partial - capabilities described in docs/README.md
- **README**: Comprehensive with quick start, features, examples

### 6.5 Documentation Gaps
1. **No automated publishing**: Docs committed to repo but not published to dedicated site (GitHub Pages, ReadTheDocs, etc.)
2. **Docs as code artifacts**: Docs checked into git rather than generated at release time
3. **No versioned docs**: Single set of docs on main branch, no per-version documentation
4. **Manual sync required**: Developers must run generate:code-docs and commit changes

---

## 7. Gaps, Risks, and Observations

### 7.1 Critical Gaps
1. **No coverage thresholds** - Tests run with coverage collection but no enforcement of minimum coverage percentages. Risk: coverage could degrade over time without detection (Evidence: [vitest.config.ts:11-15](../../../algokit-subscriber-ts/vitest.config.ts#L11-L15))
2. **Reusable workflow pinning to branch** - Both node-ci.yml and node-build-zip.yml referenced via @main instead of version tag or commit SHA (Evidence: [.github/workflows/pr.yml:13](../../../algokit-subscriber-ts/.github/workflows/pr.yml#L13), [.github/workflows/release.yml:15](../../../algokit-subscriber-ts/.github/workflows/release.yml#L15))
3. **No .nvmrc file** - Node version specified in package.json engines (>=18.0) conflicts with hardcoded 22.x in workflows, no .nvmrc for local development consistency (Evidence: [package.json:34-36](../../../algokit-subscriber-ts/package.json#L34-L36))

### 7.2 Risks
1. **Supply chain security (HIGH)**:
   - Reusable workflows pinned to @main branch can change without notice
   - Most GitHub Actions pinned to tags (v3, v4) instead of commit SHAs
   - Impact: Workflow behavior could change unexpectedly or be compromised
2. **Complex release strategy (MEDIUM)**:
   - Dual-branch strategy (main=beta, release=prod) adds complexity
   - Manual prod_release workflow required for production releases
   - Risk of merge conflicts or human error in promotion process
3. **External workflow dependency (MEDIUM)**:
   - Critical CI/CD logic in makerxstudio/shared-config repository
   - Changes to shared workflows affect all consuming repos
   - No version control over shared workflow updates
4. **Version inconsistency (LOW)**:
   - Workflow enforces Node 22.x but package.json allows >=18.0
   - Could lead to unexpected behavior if developers use Node 18-21
5. **Test infrastructure dependency (MEDIUM)**:
   - All tests require AlgoKit LocalNet running
   - No isolated unit tests for business logic
   - CI requires complex test setup
   - Impact: Slower test execution, harder to debug failures

### 7.3 Standardization Opportunities
1. **Reusable workflow versioning**: Tag releases of shared-config workflows and pin to specific versions
2. **Coverage threshold standard**: Establish minimum coverage thresholds (e.g., 80% lines, 75% branches) across AlgoKit TypeScript libraries
3. **Node version management**: Add .nvmrc file and align package.json engines with CI Node version
4. **GitHub Actions pinning**: Migrate all actions to commit SHA pinning for security
5. **Docs publishing**: Implement GitHub Pages or similar to host versioned documentation
6. **Pre-commit hooks**: Add .pre-commit-config.yaml to enforce linting, type-checking, and commit message format locally

### 7.4 Unique Patterns (Non-Issues)
1. **Dual-branch release strategy**: Intentional design for beta (main) vs stable (release) releases - appropriate for library with multiple concurrent release trains
2. **Embedded semantic-release config**: Config in package.json instead of separate file is acceptable and keeps configuration centralized
3. **Test contract with pyproject.toml**: tests/contract/ contains Algorand Python contract for integration testing - legitimate test dependency, not a mixed-stack monorepo
4. **Docs committed to repo**: Choice to commit generated docs ensures they're always available in repo and npm package - trade-off for accessibility vs automation
5. **GitHub App token**: Using GitHub App instead of GITHUB_TOKEN for releases provides better permission control and attribution
6. **No pre-commit hooks**: Commitlint enforced in CI rather than locally - acceptable pattern, allows flexibility for developers

---

## 8. Evidence Summary
- **Total Files Analyzed**: 30+
- **Key Evidence Files**:
  - [package.json:1-172](../../../algokit-subscriber-ts/package.json#L1-L172) (for versioning, scripts, semantic-release config, dependencies)
  - [.github/workflows/pr.yml:1-41](../../../algokit-subscriber-ts/.github/workflows/pr.yml#L1-L41) (for PR validation triggers and actions)
  - [.github/workflows/release.yml:1-104](../../../algokit-subscriber-ts/.github/workflows/release.yml#L1-L104) (for release automation)
  - [.github/workflows/prod_release.yml:1-44](../../../algokit-subscriber-ts/.github/workflows/prod_release.yml#L1-L44) (for production release process)
  - [vitest.config.ts:1-29](../../../algokit-subscriber-ts/vitest.config.ts#L1-L29) (for test framework and coverage config)
  - [typedoc.json:1-15](../../../algokit-subscriber-ts/typedoc.json#L1-L15) (for documentation generation)
  - [commitlint.config.cjs:1-15](../../../algokit-subscriber-ts/commitlint.config.cjs#L1-L15) (for commit convention enforcement)
  - [.github/dependabot.yml:1-9](../../../algokit-subscriber-ts/.github/dependabot.yml#L1-L9) (for dependency management)
  - [rollup.config.ts](../../../algokit-subscriber-ts/rollup.config.ts) (for build configuration)
  - [README.md:1-220](../../../algokit-subscriber-ts/README.md#L1-L220) (for project documentation)
  - tests/scenarios/*.spec.ts (for test structure - 18 test files)
  - docs/README.md (for documentation structure)
  - Reusable workflows at makerxstudio/shared-config (node-ci.yml, node-build-zip.yml)
