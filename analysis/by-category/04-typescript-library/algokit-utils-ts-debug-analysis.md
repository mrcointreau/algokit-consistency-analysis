# Repository Analysis: algokit-utils-ts-debug

## 1. Repository Overview
- **Tech Stack**: TypeScript
- **Purpose Category**: TypeScript Library (Category 4)
- **Monorepo**: No
- **Signal Files**:
  - [package.json](../../../algokit-utils-ts-debug/package.json) - Main package configuration, version, dependencies, scripts, semantic-release config
  - [jest.config.ts](../../../algokit-utils-ts-debug/jest.config.ts) - Test framework configuration
  - [commitlint.config.cjs](../../../algokit-utils-ts-debug/commitlint.config.cjs) - Commit convention enforcement
  - [typedoc.json](../../../algokit-utils-ts-debug/typedoc.json) - Documentation generation configuration
  - [.github/workflows/pr.yml](../../../algokit-utils-ts-debug/.github/workflows/pr.yml) - PR validation workflow
  - [.github/workflows/release.yml](../../../algokit-utils-ts-debug/.github/workflows/release.yml) - Release workflow
  - [.github/workflows/prod_release.yml](../../../algokit-utils-ts-debug/.github/workflows/prod_release.yml) - Production release workflow
  - [.github/dependabot.yml](../../../algokit-utils-ts-debug/.github/dependabot.yml) - Dependency update automation
  - [rollup.config.ts](../../../algokit-utils-ts-debug/rollup.config.ts) - Build configuration

---

## 2. CI/CD Findings

### 2.1 Workflow Inventory
| Workflow File | Purpose | Triggers |
|---------------|---------|----------|
| [pr.yml](../../../algokit-utils-ts-debug/.github/workflows/pr.yml) | PR validation | pull_request on main |
| [release.yml](../../../algokit-utils-ts-debug/.github/workflows/release.yml) | CD & Release | push to main/release, workflow_dispatch |
| [prod_release.yml](../../../algokit-utils-ts-debug/.github/workflows/prod_release.yml) | Production release merge | workflow_dispatch |

### 2.2 Third-Party Actions
| Action | Version | Used In | Pinned | Security Issue |
|--------|---------|---------|--------|----------------|
| makerxstudio/shared-config/.github/workflows/node-ci.yml | @main | pr.yml, release.yml | No | **HIGH PRIORITY** - Branch reference, not immutable |
| makerxstudio/shared-config/.github/workflows/node-build-zip.yml | @main | release.yml | No | **HIGH PRIORITY** - Branch reference, not immutable |
| actions/checkout | v3 | All workflows | No | **MEDIUM PRIORITY** - Tag reference, should use commit SHA |
| actions/setup-node | v3 | pr.yml, release.yml | No | **MEDIUM PRIORITY** - Tag reference, should use commit SHA |
| actions/create-github-app-token | v1 | prod_release.yml, release.yml | No | **MEDIUM PRIORITY** - Tag reference, should use commit SHA |
| devmasx/merge-branch | 854d3ac71ed1e9deb668e0074781b81fdd6e771f | prod_release.yml | Yes | ✅ Properly pinned to commit SHA |
| actions/download-artifact | v4 | release.yml | No | **MEDIUM PRIORITY** - Tag reference, should use commit SHA |

**SECURITY FINDINGS**:
- **CRITICAL**: Two reusable workflows pinned to `@main` branch (Evidence: [pr.yml:12](../../../algokit-utils-ts-debug/.github/workflows/pr.yml#L12), [release.yml:19](../../../algokit-utils-ts-debug/.github/workflows/release.yml#L19), [release.yml:49](../../../algokit-utils-ts-debug/.github/workflows/release.yml#L49))
- **HIGH**: 5 actions pinned to tags (v1, v3, v4) instead of immutable commit SHAs
- **POSITIVE**: devmasx/merge-branch correctly pinned to commit SHA (Evidence: [prod_release.yml:25](../../../algokit-utils-ts-debug/.github/workflows/prod_release.yml#L25))

### 2.3 Runtime Versions
- **Node Version**: 18.x (Source: Hardcoded in workflows)
  - PR workflow: 18.x (Evidence: [pr.yml:14](../../../algokit-utils-ts-debug/.github/workflows/pr.yml#L14), [pr.yml:35](../../../algokit-utils-ts-debug/.github/workflows/pr.yml#L35))
  - Release workflow: 18.x for CI/build, 20.x for semantic-release (Evidence: [release.yml:21](../../../algokit-utils-ts-debug/.github/workflows/release.yml#L21), [release.yml:54](../../../algokit-utils-ts-debug/.github/workflows/release.yml#L54), [release.yml:80](../../../algokit-utils-ts-debug/.github/workflows/release.yml#L80))
  - Package.json engines: >=18.0 (Evidence: [package.json:9](../../../algokit-utils-ts-debug/package.json#L9))
- **Python Version**: N/A
- **Source of Truth**: Hardcoded in workflows, no .nvmrc file

### 2.4 Release Automation
- **Mechanism**: semantic-release (fully automated)
- **Config Location**: Inline in [package.json:98-156](../../../algokit-utils-ts-debug/package.json#L98-L156)
- **Triggers**: Push to main or release branches, or manual workflow_dispatch
- **Publishing**: Automated to npm from dist/ directory (Evidence: [package.json:149-152](../../../algokit-utils-ts-debug/package.json#L149-L152))

### 2.5 CI/CD Gaps & Anomalies
1. **No .nvmrc file**: Node version hardcoded in workflows instead of using a version file
2. **Mixed Node versions**: Uses Node 18.x for build but 20.x for semantic-release (Evidence: [release.yml:80](../../../algokit-utils-ts-debug/.github/workflows/release.yml#L80))
3. **Reusable workflows from external org**: Uses makerxstudio/shared-config, not algorandfoundation org
4. **Manual production release**: Requires workflow_dispatch to merge main→release→main (Evidence: [prod_release.yml:4](../../../algokit-utils-ts-debug/.github/workflows/prod_release.yml#L4))
5. **No standalone test workflow**: Tests only run as part of CI via reusable workflow

---

## 3. Branching Strategy Findings

### 3.1 Branch Triggers
| Workflow | Branches | Tags | Purpose |
|----------|----------|------|---------|
| pr.yml | main | N/A | PR validation before merge |
| release.yml | main, release | N/A | Automated release on push |
| prod_release.yml | Manual merge: main→release→main | N/A | Production release promotion |

### 3.2 Commit Conventions
- **Commitlint**: Yes (Config: conventional with customizations)
  - Config file: [commitlint.config.cjs](../../../algokit-utils-ts-debug/commitlint.config.cjs)
  - Extends: @commitlint/config-conventional
  - Customizations: Relaxed subject-case rules (Evidence: [commitlint.config.cjs:5](../../../algokit-utils-ts-debug/commitlint.config.cjs#L5))
  - Enforced in CI: Yes (Evidence: [pr.yml:16](../../../algokit-utils-ts-debug/.github/workflows/pr.yml#L16), [release.yml:22](../../../algokit-utils-ts-debug/.github/workflows/release.yml#L22))
- **Pre-commit Hooks**: No (no .pre-commit-config.yaml file)
  - Local pre-commit script exists in package.json but not Git hook-based (Evidence: [package.json:47](../../../algokit-utils-ts-debug/package.json#L47))

### 3.3 Release Branch Strategy
- **Semantic-Release Branches**:
  - `main` branch with prerelease: "beta" (Evidence: [package.json:100-103](../../../algokit-utils-ts-debug/package.json#L100-L103))
  - `release` branch for stable releases (Evidence: [package.json:104-106](../../../algokit-utils-ts-debug/package.json#L104-L106))
- **Environment Branches**: None
- **Pattern**: Two-branch strategy (main=beta, release=stable)

### 3.4 Trunk-Based Compliance
- **Assessment**: Partially compliant
- **Evidence**:
  - Has a main branch for development with beta prereleases
  - Has a separate long-lived `release` branch for production releases
  - Manual promotion required from main→release via prod_release.yml workflow
  - Not fully trunk-based due to long-lived release branch
  - Pattern: main (beta) → release (stable) promotion model

---

## 4. Release & Versioning Findings

### 4.1 Release Mechanism
- **Tool**: semantic-release
- **Config File**: Inline in [package.json](../../../algokit-utils-ts-debug/package.json#L98-L156)
- **Automation Level**: Fully automated (commit analysis → version bump → changelog → npm publish → GitHub release)

### 4.2 Tag Format
- **Format**: v{version} (default semantic-release format)
- **Source**: semantic-release default behavior
- **Branches**:
  - main: Creates beta prereleases (e.g., v0.1.0-beta.1)
  - release: Creates stable releases (e.g., v0.1.0)

### 4.3 Version Sources
| File | Field | Current Value | Role |
|------|-------|---------------|------|
| [package.json:3](../../../algokit-utils-ts-debug/package.json#L3) | version | 0.1.0 | Source of truth, updated by semantic-release |
| dist/package.json | version | (Generated) | Published package version, copied from build |

### 4.4 Version Propagation
- **Auto-commit**: Yes (By: semantic-release)
- **Lockfile Updates**: Automatic (package-lock.json committed, Evidence: package-lock.json exists in repo)
- **Build Output**: dist/ directory with copied package.json (Evidence: [package.json:36](../../../algokit-utils-ts-debug/package.json#L36))
- **Merge-back**: Manual merge from release→main after production release (Evidence: [prod_release.yml:31-38](../../../algokit-utils-ts-debug/.github/workflows/prod_release.yml#L31-L38))

### 4.5 Monorepo Version Strategy (if applicable)
- **N/A**: Not a monorepo

### 4.6 Versioning Observations
- **Dual-branch versioning**: main produces beta versions, release produces stable versions
- **Build artifact publishing**: Publishes from dist/ directory, not root (Evidence: [package.json:151](../../../algokit-utils-ts-debug/package.json#L151))
- **Version sync**: After stable release, changes merged back to main to sync version (Evidence: [prod_release.yml:31-38](../../../algokit-utils-ts-debug/.github/workflows/prod_release.yml#L31-L38))

---

## 5. Testing Strategy Findings

### 5.1 Test Framework
- **Framework**: Jest
- **Config File**: [jest.config.ts](../../../algokit-utils-ts-debug/jest.config.ts)
- **Preset**: ts-jest
- **Test Environment**: node

### 5.2 Coverage Configuration
- **Tool**: Jest built-in coverage (via --coverage flag)
- **Coverage Enabled**: Yes (Evidence: [package.json:38](../../../algokit-utils-ts-debug/package.json#L38))
- **Thresholds**: None configured in jest.config.ts
- **Reporting**: Default jest coverage reporting (no explicit lcov/html config)
- **Collection Method**: Via test script (Evidence: `jest --coverage`)

### 5.3 Test Structure
- **Separation**: Co-located with source files
- **File Patterns**: *.spec.ts (Evidence: [jest.config.ts:6](../../../algokit-utils-ts-debug/jest.config.ts#L6))
- **Test Files Found**: 2 spec files
  - src/debugging/writeAVMDebugTrace.spec.ts
  - src/debugging/writeTealDebugSourceMaps.spec.ts
- **Test Categories**: Unit tests (co-located with implementation)

### 5.4 CI Enforcement
- **Test Execution**: Yes (via reusable workflow makerxstudio/shared-config/.github/workflows/node-ci.yml)
- **Coverage Enforcement**: No threshold enforcement detected
- **Matrix Testing**: No (single Node version 18.x)
- **Pre-test Setup**: Requires AlgoKit LocalNet (Evidence: [pr.yml:18-21](../../../algokit-utils-ts-debug/.github/workflows/pr.yml#L18-L21))

### 5.5 Testing Gaps
1. **No coverage thresholds**: Jest configured with --coverage but no minimum thresholds enforced
2. **No matrix testing**: Only tests against Node 18.x, despite supporting >=18.0
3. **Limited test count**: Only 2 test files found
4. **No e2e test directory**: Tests are only co-located unit tests
5. **No explicit coverage reporting config**: Uses defaults, no lcov output configuration visible

---

## 6. Documentation Findings

### 6.1 Documentation Tooling
- **Tool**: TypeDoc with markdown plugin
- **Config File**: [typedoc.json](../../../algokit-utils-ts-debug/typedoc.json)
- **Plugin**: typedoc-plugin-markdown

### 6.2 Generation Settings
- **Entry Points**: [src/index.ts](../../../algokit-utils-ts-debug/typedoc.json#L3)
- **Output Directory**: docs/code/ (Evidence: [typedoc.json:6](../../../algokit-utils-ts-debug/typedoc.json#L6))
- **Theme**: default (Evidence: [typedoc.json:8](../../../algokit-utils-ts-debug/typedoc.json#L8))
- **Format**: Markdown (via typedoc-plugin-markdown)
- **Strategy**: Expand entry points (Evidence: [typedoc.json:5](../../../algokit-utils-ts-debug/typedoc.json#L5))
- **Git Revision**: main (Evidence: [typedoc.json:12](../../../algokit-utils-ts-debug/typedoc.json#L12))

### 6.3 Publishing Automation
- **Hosting**: None detected (githubPages: false in config)
- **Workflow**: Docs verification in CI (Evidence: [pr.yml:25-44](../../../algokit-utils-ts-debug/.github/workflows/pr.yml#L25-L44), [release.yml:30-45](../../../algokit-utils-ts-debug/.github/workflows/release.yml#L30-L45))
- **Triggers**: PR validation and release workflows check docs are up-to-date
- **Enforcement**: CI fails if generated docs differ from committed docs (Evidence: [pr.yml:44](../../../algokit-utils-ts-debug/.github/workflows/pr.yml#L44))

### 6.4 Documentation Structure
- **API Docs**: Yes (TypeDoc-generated in docs/code/)
- **Guides/Tutorials**: Yes (README.md with usage examples)
- **Examples**: Yes (README.md contains TypeScript usage examples, Evidence: [README.md:19-31](../../../algokit-utils-ts-debug/README.md#L19-L31))
- **Architecture Docs**: Limited (README.md overview section, Evidence: [README.md:35-43](../../../algokit-utils-ts-debug/README.md#L35-L43))

### 6.5 Documentation Gaps
1. **No automated publishing**: Docs committed to repo but not published to hosted site
2. **No ReadTheDocs/GitHub Pages integration**: Static docs in repo only
3. **Manual doc generation required**: Developers must run `npm run generate:code-docs` before committing
4. **Version-specific docs**: No versioned documentation strategy visible

---

## 7. Gaps, Risks, and Observations

### 7.1 Critical Gaps
1. **Unpinned reusable workflows** (Evidence: [pr.yml:12](../../../algokit-utils-ts-debug/.github/workflows/pr.yml#L12), [release.yml:19](../../../algokit-utils-ts-debug/.github/workflows/release.yml#L19), [release.yml:49](../../../algokit-utils-ts-debug/.github/workflows/release.yml#L49))
   - Using `@main` branch reference for makerxstudio/shared-config workflows
   - High supply chain security risk
2. **No coverage thresholds** (Evidence: [jest.config.ts](../../../algokit-utils-ts-debug/jest.config.ts))
   - Coverage collected but not enforced
   - Risk of quality degradation over time
3. **Manual production release process** (Evidence: [prod_release.yml](../../../algokit-utils-ts-debug/.github/workflows/prod_release.yml))
   - Requires manual workflow_dispatch to promote main→release
   - Error-prone manual step in release pipeline

### 7.2 Risks
1. **Security: Supply Chain**
   - Impact: HIGH - Malicious code could be injected via reusable workflow updates
   - Prevalence: 2 reusable workflows + 5 GitHub actions unpinned
   - Recommendation: Pin all actions and workflows to commit SHAs

2. **Reliability: No Coverage Enforcement**
   - Impact: MEDIUM - Test coverage could degrade without detection
   - Evidence: No thresholds in jest.config.ts
   - Recommendation: Add coverage thresholds (e.g., 80% lines, 75% branches)

3. **Complexity: Two-Branch Release Strategy**
   - Impact: MEDIUM - Manual promotion step adds complexity
   - Evidence: Separate prod_release.yml workflow required
   - Recommendation: Consider simplifying to trunk-based with feature flags

4. **Maintainability: Hardcoded Node Versions**
   - Impact: LOW - Must update multiple workflow files when changing Node version
   - Evidence: No .nvmrc file, version hardcoded in 3 places
   - Recommendation: Add .nvmrc and reference it in workflows

### 7.3 Standardization Opportunities
1. **Reusable Workflows**: Already using makerxstudio/shared-config but should migrate to algorandfoundation org
2. **Node Version Management**: Could standardize .nvmrc usage across all TypeScript repos
3. **Coverage Thresholds**: Could standardize on 80/75/80/80 (lines/branches/functions/statements)
4. **Documentation Publishing**: Could automate docs publishing to GitHub Pages like other AlgoKit repos
5. **Semantic-Release Config**: Could extract inline config to separate .releaserc.json for clarity

### 7.4 Unique Patterns (Non-Issues)
1. **Beta-first release strategy**: main branch produces beta releases by default
   - Legitimate for a library that wants continuous beta releases
   - Production releases require explicit promotion
2. **External LocalNet dependency for tests**: Tests require AlgoKit LocalNet running
   - Appropriate for a debugging utility that tests against real blockchain
   - Well-documented in pre-test-script (Evidence: [pr.yml:18-21](../../../algokit-utils-ts-debug/.github/workflows/pr.yml#L18-L21))
3. **Dual Node versions**: Uses Node 18.x for build, 20.x for semantic-release
   - Semantic-release requires Node 20+ while package supports Node 18+
   - Documented in comment (Evidence: [release.yml:76](../../../algokit-utils-ts-debug/.github/workflows/release.yml#L76))
4. **Co-located tests**: Test files alongside source (*.spec.ts in src/)
   - Acceptable pattern for TypeScript projects
   - Jest configured to find them (Evidence: [jest.config.ts:6](../../../algokit-utils-ts-debug/jest.config.ts#L6))

---

## 8. Evidence Summary
- **Total Files Analyzed**: 13
- **Key Evidence Files**:
  - [package.json](../../../algokit-utils-ts-debug/package.json) - Version, dependencies, scripts, semantic-release config
  - [jest.config.ts](../../../algokit-utils-ts-debug/jest.config.ts) - Test framework configuration
  - [commitlint.config.cjs](../../../algokit-utils-ts-debug/commitlint.config.cjs) - Commit convention enforcement
  - [typedoc.json](../../../algokit-utils-ts-debug/typedoc.json) - Documentation generation
  - [.github/workflows/pr.yml](../../../algokit-utils-ts-debug/.github/workflows/pr.yml) - PR validation, unpinned actions
  - [.github/workflows/release.yml](../../../algokit-utils-ts-debug/.github/workflows/release.yml) - Release automation, unpinned actions
  - [.github/workflows/prod_release.yml](../../../algokit-utils-ts-debug/.github/workflows/prod_release.yml) - Manual production promotion
  - [.github/dependabot.yml](../../../algokit-utils-ts-debug/.github/dependabot.yml) - Dependency updates
  - [README.md](../../../algokit-utils-ts-debug/README.md) - Usage documentation and examples
  - [rollup.config.ts](../../../algokit-utils-ts-debug/rollup.config.ts) - Build configuration
  - [src/index.ts](../../../algokit-utils-ts-debug/src/index.ts) - Main entry point
  - [src/debugging/writeAVMDebugTrace.spec.ts](../../../algokit-utils-ts-debug/src/debugging/writeAVMDebugTrace.spec.ts) - Test file
  - [src/debugging/writeTealDebugSourceMaps.spec.ts](../../../algokit-utils-ts-debug/src/debugging/writeTealDebugSourceMaps.spec.ts) - Test file

---

## 9. Summary Assessment

**Strengths**:
- ✅ Fully automated semantic-release pipeline
- ✅ Comprehensive commitlint configuration enforced in CI
- ✅ TypeDoc documentation with CI validation
- ✅ Dependabot configured for automatic dependency updates
- ✅ Reusable workflows for CI/CD consistency
- ✅ Beta release strategy for continuous delivery

**Critical Issues**:
- ❌ Unpinned reusable workflows (supply chain security risk)
- ❌ Unpinned GitHub Actions (5 actions using tags instead of SHAs)
- ❌ No test coverage thresholds enforced
- ❌ Manual production release process adds complexity
- ❌ No .nvmrc file for Node version management

**Compliance**:
- Trunk-Based Development: **Partially Compliant** (uses main + release dual-branch strategy)
- Semantic Versioning: **Compliant** (automated via semantic-release)
- Commit Conventions: **Compliant** (commitlint enforced in CI)
- Documentation: **Partially Compliant** (generated but not published)
- Testing: **Partially Compliant** (tests exist but no coverage enforcement)
