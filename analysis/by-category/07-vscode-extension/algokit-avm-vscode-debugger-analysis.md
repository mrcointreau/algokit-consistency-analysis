# Repository Analysis: algokit-avm-vscode-debugger

## 1. Repository Overview
- **Tech Stack**: TypeScript
- **Purpose Category**: VSCode Extension (Category 7)
- **Monorepo**: No
- **Signal Files**:
  - Configuration: [package.json](../../../algokit-avm-vscode-debugger/package.json), [tsconfig.json](../../../algokit-avm-vscode-debugger/tsconfig.json), [vitest.config.ts](../../../algokit-avm-vscode-debugger/vitest.config.ts)
  - CI/CD: [.github/workflows/build-and-test.yaml](../../../algokit-avm-vscode-debugger/.github/workflows/build-and-test.yaml), [.github/workflows/cd.yaml](../../../algokit-avm-vscode-debugger/.github/workflows/cd.yaml), [.github/workflows/pr.yaml](../../../algokit-avm-vscode-debugger/.github/workflows/pr.yaml)
  - Release: [.releaserc.json](../../../algokit-avm-vscode-debugger/.releaserc.json)
  - Testing: [vitest.config.ts](../../../algokit-avm-vscode-debugger/vitest.config.ts), [test/wdio.conf.ts](../../../algokit-avm-vscode-debugger/test/wdio.conf.ts)
  - Documentation: [README.md](../../../algokit-avm-vscode-debugger/README.md), [CONTRIBUTING.md](../../../algokit-avm-vscode-debugger/CONTRIBUTING.md)
  - VSCode Extension: [package.json](../../../algokit-avm-vscode-debugger/package.json) (activationEvents, contributes sections)
  - Code Quality: [.eslintrc](../../../algokit-avm-vscode-debugger/.eslintrc), [.prettierrc.js](../../../algokit-avm-vscode-debugger/.prettierrc.js)

---

## 2. CI/CD Findings

### 2.1 Workflow Inventory
| Workflow File | Purpose | Triggers |
|---------------|---------|----------|
| [build-and-test.yaml](../../../algokit-avm-vscode-debugger/.github/workflows/build-and-test.yaml) | Reusable build and test workflow | workflow_call |
| [pr.yaml](../../../algokit-avm-vscode-debugger/.github/workflows/pr.yaml) | PR validation | pull_request on branches: [main] |
| [cd.yaml](../../../algokit-avm-vscode-debugger/.github/workflows/cd.yaml) | Release automation | push to main, workflow_dispatch |

### 2.2 Third-Party Actions
| Action | Version | Used In | Pinned | Security Status |
|--------|---------|---------|--------|-----------------|
| actions/checkout | v3 | build-and-test.yaml:15, build-and-test.yaml:51 | Tag-based | ⚠️ UNPINNED |
| actions/checkout | v4 | cd.yaml:39 | Tag-based | ⚠️ UNPINNED |
| actions/setup-node | v3 | build-and-test.yaml:20, build-and-test.yaml:56, cd.yaml:45 | Tag-based | ⚠️ UNPINNED |
| actions/upload-artifact | v4 | build-and-test.yaml:33 | Tag-based | ⚠️ UNPINNED |
| actions/download-artifact | v4 | cd.yaml:53 | Tag-based | ⚠️ UNPINNED |
| coactions/setup-xvfb | v1 | build-and-test.yaml:65 | Tag-based | ⚠️ UNPINNED |
| actions/create-github-app-token | v1 | cd.yaml:33 | Tag-based | ⚠️ UNPINNED |

**SECURITY FINDINGS**:
- **HIGH PRIORITY**: All 7 third-party actions are pinned to tags (v1, v3, v4) instead of immutable commit SHAs
- **RISK**: Tag-based pinning creates supply chain vulnerability - tags can be moved or deleted by action maintainers
- **RECOMMENDATION**: Pin all actions to commit SHAs for immutable references (e.g., `actions/checkout@<commit-sha>`)
- **AFFECTED WORKFLOWS**: All workflows (build-and-test.yaml, cd.yaml, pr.yaml)

### 2.3 Runtime Versions
- **Node Version**: 18.x (Source: hardcoded in workflows at [build-and-test.yaml:22](../../../algokit-avm-vscode-debugger/build-and-test.yaml#L22), [build-and-test.yaml:58](../../../algokit-avm-vscode-debugger/build-and-test.yaml#L58))
- **Node Version (Release)**: 20.x (Source: hardcoded in [cd.yaml:47](../../../algokit-avm-vscode-debugger/cd.yaml#L47))
- **VSCode Version**: ^1.92.0 (Source: [package.json:20](../../../algokit-avm-vscode-debugger/package.json#L20) engines field)
- **Package Manager**: npm with package-lock.json

**INCONSISTENCY**: Different Node.js versions used in build/test (18.x) vs release (20.x) workflows

### 2.4 Release Automation
- **Mechanism**: semantic-release with semantic-release-vsce plugin
- **Triggers**:
  - Automatic on push to main (beta releases by default)
  - Manual via workflow_dispatch with production_release input parameter
- **VSCode Publishing**: Manual publish to marketplace only on production releases (Evidence: [cd.yaml:70-74](../../../algokit-avm-vscode-debugger/cd.yaml#L70-L74))
- **Dual Release Strategy**:
  - Beta releases: `npx semantic-release` (Evidence: [cd.yaml:58-62](../../../algokit-avm-vscode-debugger/cd.yaml#L58-L62))
  - Production releases: `npx semantic-release --branches main` with marketplace publish (Evidence: [cd.yaml:64-74](../../../algokit-avm-vscode-debugger/cd.yaml#L64-L74))

### 2.5 CI/CD Gaps & Anomalies
1. **Inconsistent Node.js versions**: Build/test uses 18.x, release uses 20.x (may cause runtime discrepancies)
2. **No .nvmrc file**: Runtime version not externalized, duplicated across workflows
3. **Missing version matrix testing**: Tests run on multiple OS (ubuntu, windows) but only single Node version
4. **Artifact dependency**: Release job downloads build artifacts but build runs on Node 18.x while release runs on Node 20.x
5. **Coverage not enforced**: Tests run but no coverage thresholds defined or enforced in CI

---

## 3. Branching Strategy Findings

### 3.1 Branch Triggers
| Workflow | Branches | Tags | Purpose |
|----------|----------|------|---------|
| pr.yaml | main | N/A | PR validation |
| cd.yaml | main | N/A | Continuous delivery (beta releases) |
| cd.yaml (manual) | main | N/A | Production releases via workflow_dispatch |

### 3.2 Commit Conventions
- **Commitlint**: Yes (Config: conventional via @commitlint/config-conventional)
  - Evidence: [package.json:56-57](../../../algokit-avm-vscode-debugger/package.json#L56-L57) devDependencies
  - Evidence: [CONTRIBUTING.md:34-36](../../../algokit-avm-vscode-debugger/CONTRIBUTING.md#L34-L36) documents Conventional Commits usage
- **Pre-commit Hooks**: No `.pre-commit-config.yaml` found
- **Manual Pre-commit Script**: Yes (Evidence: [package.json:47](../../../algokit-avm-vscode-debugger/package.json#L47) - `pre-commit` script runs build, lint:fix, audit, format, test)
- **Conventional Commits Evidence**: Recent commits follow convention (fix:, chore:, feat:, ci:) (Evidence: git log analysis)

### 3.3 Release Branch Strategy
- **Semantic-Release Branches**: [main, do-not-delete] (Evidence: [.releaserc.json:2-9](../../../algokit-avm-vscode-debugger/.releaserc.json#L2-L9))
- **Branch Configuration**:
  - `main`: prerelease mode "beta" (Evidence: [.releaserc.json:3-6](../../../algokit-avm-vscode-debugger/.releaserc.json#L3-L6))
  - `do-not-delete`: production releases (Evidence: [.releaserc.json:7-9](../../../algokit-avm-vscode-debugger/.releaserc.json#L7-L9))
- **Environment Branches**: None
- **Dual-Mode Release Strategy**:
  - Default: Beta releases from main branch
  - Override: Production releases via workflow_dispatch input parameter

**UNUSUAL PATTERN**: The `do-not-delete` branch name is non-standard. Typical semantic-release configurations use descriptive names like `production`, `stable`, or just `main` for production releases.

### 3.4 Trunk-Based Compliance
- **Assessment**: Partially compliant with prerelease workflow
- **Evidence**:
  - Main branch configured as beta prerelease channel (Evidence: [.releaserc.json:3-6](../../../algokit-avm-vscode-debugger/.releaserc.json#L3-L6))
  - Production releases controlled via workflow_dispatch parameter, not separate branch (Evidence: [cd.yaml:9-12](../../../algokit-avm-vscode-debugger/cd.yaml#L9-L12))
  - No long-lived feature branches or git-flow pattern detected
  - Manual override allows production releases from main without switching branches

---

## 4. Release & Versioning Findings

### 4.1 Release Mechanism
- **Tool**: semantic-release with semantic-release-vsce plugin
- **Config File**: [.releaserc.json](../../../algokit-avm-vscode-debugger/.releaserc.json)
- **Automation Level**: Fully automated for beta, semi-automated for production
- **VSIX Packaging**: Automated via semantic-release-vsce plugin (Evidence: [.releaserc.json:56-61](../../../algokit-avm-vscode-debugger/.releaserc.json#L56-L61))
- **Marketplace Publishing**: Manual trigger required via workflow_dispatch (Evidence: [cd.yaml:70-74](../../../algokit-avm-vscode-debugger/cd.yaml#L70-L74))

### 4.2 Tag Format
- **Format**: v1.2.3, v1.2.3-beta.N (semantic versioning with "v" prefix)
- **Source**: semantic-release default tag format
- **Evidence**: Git tags show pattern: v1.1.7, v1.1.7-beta.1, v1.1.6-beta.9, etc.
- **Consistency**: Follows semantic versioning with beta prerelease identifiers

### 4.3 Version Sources
| File | Field | Current Value | Role |
|------|-------|---------------|------|
| [package.json:4](../../../algokit-avm-vscode-debugger/package.json#L4) | version | 0.1.0 | Source of truth (updated by semantic-release) |

**VERSION PROPAGATION**: semantic-release automatically updates package.json version field and commits changes back to repository

### 4.4 Version Propagation
- **Auto-commit**: Yes (By: semantic-release)
- **Lockfile Updates**: Automatic (package-lock.json committed to repository)
- **Semantic-Release Plugins**:
  1. @semantic-release/commit-analyzer (Evidence: [.releaserc.json:13-30](../../../algokit-avm-vscode-debugger/.releaserc.json#L13-L30))
  2. @semantic-release/release-notes-generator (Evidence: [.releaserc.json:32-54](../../../algokit-avm-vscode-debugger/.releaserc.json#L32-L54))
  3. semantic-release-vsce (Evidence: [.releaserc.json:56-61](../../../algokit-avm-vscode-debugger/.releaserc.json#L56-L61))
  4. @semantic-release/github (Evidence: [.releaserc.json:63-71](../../../algokit-avm-vscode-debugger/.releaserc.json#L63-L71))

### 4.5 Monorepo Version Strategy
- **N/A**: Not a monorepo (single package.json at root)

### 4.6 Custom Release Rules
- **Extended Release Types**: build, chore, and docs commits trigger patch releases (Evidence: [.releaserc.json:16-28](../../../algokit-avm-vscode-debugger/.releaserc.json#L16-L28))
- **Standard Types**: feat → minor, fix → patch (conventional defaults)

---

## 5. Testing Strategy Findings

### 5.1 Test Framework
- **Frameworks**:
  - **Unit Tests**: Vitest (Evidence: [vitest.config.ts](../../../algokit-avm-vscode-debugger/vitest.config.ts))
  - **E2E Tests**: WebdriverIO with mocha framework (Evidence: [test/wdio.conf.ts](../../../algokit-avm-vscode-debugger/test/wdio.conf.ts))
- **Config Files**:
  - [vitest.config.ts](../../../algokit-avm-vscode-debugger/vitest.config.ts) for unit tests
  - [test/wdio.conf.ts](../../../algokit-avm-vscode-debugger/test/wdio.conf.ts) for E2E tests
- **Dual Testing Strategy**: Unit tests in `src/**/*.spec.ts`, E2E tests in `test/src/**/*.spec.ts`

### 5.2 Coverage Configuration
- **Tool**: Not configured (vitest supports coverage but no config present)
- **Thresholds**: None defined
- **Reporting**: None configured
- **GAP**: No coverage collection, thresholds, or reporting in vitest.config.ts (Evidence: [vitest.config.ts:1-10](../../../algokit-avm-vscode-debugger/vitest.config.ts#L1-L10))

### 5.3 Test Structure
- **Separation**:
  - Unit tests: `src/**/*.spec.ts` (Evidence: [vitest.config.ts:7](../../../algokit-avm-vscode-debugger/vitest.config.ts#L7))
  - E2E tests: `test/src/**/*.spec.ts` (Evidence: [test/wdio.conf.ts:16](../../../algokit-avm-vscode-debugger/test/wdio.conf.ts#L16))
- **File Patterns**:
  - Unit: `*.spec.ts` (Evidence: [vitest.config.ts:7](../../../algokit-avm-vscode-debugger/vitest.config.ts#L7))
  - E2E: `*.spec.ts` (Evidence: [test/wdio.conf.ts:16](../../../algokit-avm-vscode-debugger/test/wdio.conf.ts#L16))
- **Test Files Found**:
  - Unit: [src/utils.spec.ts](../../../algokit-avm-vscode-debugger/src/utils.spec.ts)
  - E2E: [test/src/extension.spec.ts](../../../algokit-avm-vscode-debugger/test/src/extension.spec.ts)
- **E2E Testing Environment**: VSCode extension host with wdio-vscode-service (Evidence: [test/wdio.conf.ts:35](../../../algokit-avm-vscode-debugger/test/wdio.conf.ts#L35))

### 5.4 CI Enforcement
- **Test Execution**: Yes (In workflow: [build-and-test.yaml](../../../algokit-avm-vscode-debugger/build-and-test.yaml))
- **Unit Tests**: Via `npm run test:unit` (vitest) (Evidence: [package.json:43](../../../algokit-avm-vscode-debugger/package.json#L43))
- **E2E Tests**: Via `npm run test:run` (wdio) with xvfb setup (Evidence: [build-and-test.yaml:65-67](../../../algokit-avm-vscode-debugger/build-and-test.yaml#L65-L67))
- **Test Script**: Sequential execution via `npm run test` = `run-s test:*` (Evidence: [package.json:42](../../../algokit-avm-vscode-debugger/package.json#L42))
- **Coverage Enforcement**: No (no coverage thresholds defined or enforced)
- **Matrix Testing**: Yes, tests run on ubuntu-latest and windows-latest (Evidence: [build-and-test.yaml:41-42](../../../algokit-avm-vscode-debugger/build-and-test.yaml#L41-L42))

### 5.5 Testing Gaps
1. **No coverage configuration**: vitest.config.ts lacks coverage settings (threshold, reporters, output)
2. **No coverage enforcement in CI**: Builds pass regardless of coverage levels
3. **Limited unit test coverage**: Only one unit test file found (utils.spec.ts)
4. **No coverage reporting**: No lcov, html, or PR comment reports
5. **Single Node version**: Only tests on Node 18.x, not multiple versions despite using different version in release (20.x)

---

## 6. Documentation Findings

### 6.1 Documentation Tooling
- **Tool**: Manual markdown (no automated API documentation)
- **Config File**: N/A (no typedoc.json, sphinx, or mkdocs config)
- **Documentation Files**:
  - [README.md](../../../algokit-avm-vscode-debugger/README.md) (comprehensive user guide)
  - [CONTRIBUTING.md](../../../algokit-avm-vscode-debugger/CONTRIBUTING.md) (developer guide)
  - GitHub issue templates in .github/ISSUE_TEMPLATE/

### 6.2 Generation Settings
- **Theme**: N/A (manual documentation)
- **Extensions**: N/A
- **Entry Points**: N/A
- **Build Commands**: None (no doc generation scripts in [package.json](../../../algokit-avm-vscode-debugger/package.json))

### 6.3 Publishing Automation
- **Hosting**: None (documentation embedded in repository README)
- **Workflow**: None
- **Triggers**: N/A
- **VSCode Marketplace**: Extension published to marketplace with manual trigger (Evidence: [cd.yaml:70-74](../../../algokit-avm-vscode-debugger/cd.yaml#L70-L74))

### 6.4 Documentation Structure
- **API Docs**: No (no automated API documentation generation)
- **Guides/Tutorials**: Yes (comprehensive in [README.md](../../../algokit-avm-vscode-debugger/README.md))
  - Prerequisites section (Evidence: [README.md:42-48](../../../algokit-avm-vscode-debugger/README.md#L42-L48))
  - Quick Start guide (Evidence: [README.md:49-82](../../../algokit-avm-vscode-debugger/README.md#L49-L82))
  - Detailed usage sections for AlgoKit and custom projects (Evidence: [README.md:84-99](../../../algokit-avm-vscode-debugger/README.md#L84-L99))
  - Features table with screenshots (Evidence: [README.md:224-241](../../../algokit-avm-vscode-debugger/README.md#L224-L241))
  - Commands and settings reference (Evidence: [README.md:200-223](../../../algokit-avm-vscode-debugger/README.md#L200-L223))
- **Examples**: Yes (examples/ directory with workspace configurations)
- **Architecture Docs**: No (no ARCHITECTURE.md or design docs)
- **Contributing Guide**: Yes ([CONTRIBUTING.md](../../../algokit-avm-vscode-debugger/CONTRIBUTING.md)) with setup instructions and commit conventions

### 6.5 Documentation Gaps
1. **No API documentation**: No typedoc or automated code documentation
2. **No architecture documentation**: No ARCHITECTURE.md explaining extension design
3. **No changelog**: No CHANGELOG.md (releases tracked via GitHub releases)
4. **No documentation hosting**: All docs in repository, not published to separate docs site
5. **No version-specific docs**: README doesn't specify which version it documents

---

## 7. Gaps, Risks, and Observations

### 7.1 Critical Gaps
1. **No coverage enforcement** (Evidence: [vitest.config.ts](../../../algokit-avm-vscode-debugger/vitest.config.ts) lacks coverage configuration, [build-and-test.yaml](../../../algokit-avm-vscode-debugger/build-and-test.yaml) doesn't enforce coverage)
   - Impact: Code quality may degrade without coverage tracking
   - Only 1 unit test file found for entire extension codebase

2. **Inconsistent Node.js versions** (Evidence: [build-and-test.yaml:22,58](../../../algokit-avm-vscode-debugger/build-and-test.yaml#L22) uses 18.x, [cd.yaml:47](../../../algokit-avm-vscode-debugger/cd.yaml#L47) uses 20.x)
   - Impact: Potential runtime discrepancies between build and release artifacts
   - Risk of deployment issues not caught in testing

3. **Missing .nvmrc file** (Evidence: file not found in repository)
   - Impact: Node version not externalized, hardcoded in workflows
   - Developers may use different Node versions locally

### 7.2 Risks

1. **Security: Unpinned GitHub Actions** (HIGH PRIORITY)
   - Evidence: All 7 actions use tag-based refs (v1, v3, v4) instead of commit SHAs
   - Impact: Supply chain vulnerability - tags can be moved by upstream maintainers
   - Affected: [build-and-test.yaml](../../../algokit-avm-vscode-debugger/.github/workflows/build-and-test.yaml), [cd.yaml](../../../algokit-avm-vscode-debugger/.github/workflows/cd.yaml)
   - Severity: P0 - High impact security risk

2. **Reliability: No coverage thresholds**
   - Evidence: [vitest.config.ts](../../../algokit-avm-vscode-debugger/vitest.config.ts) has no coverage configuration
   - Impact: Quality degradation risk, no minimum coverage enforcement
   - Severity: Medium - affects long-term maintainability

3. **Maintainability: Complex release strategy**
   - Evidence: Two-mode release (beta via branch config, production via workflow input) at [cd.yaml:58-74](../../../algokit-avm-vscode-debugger/cd.yaml#L58-L74)
   - Impact: Potential for confusion, manual intervention required for production
   - Non-standard branch name "do-not-delete" (Evidence: [.releaserc.json:7-9](../../../algokit-avm-vscode-debugger/.releaserc.json#L7-L9))

4. **Reliability: Artifact build/release version mismatch**
   - Evidence: Artifacts built on Node 18.x, released on Node 20.x
   - Impact: Potential runtime incompatibilities not caught before marketplace publish
   - Severity: Medium - could cause extension failures in production

### 7.3 Standardization Opportunities

1. **Reusable workflow pattern**: [build-and-test.yaml](../../../algokit-avm-vscode-debugger/.github/workflows/build-and-test.yaml) already uses workflow_call
   - Opportunity: This pattern could be extracted to shared repository for reuse across VSCode extensions
   - Benefit: Consistency across Algorand Foundation VSCode extensions

2. **Semantic-release configuration template**
   - Evidence: Well-configured [.releaserc.json](../../../algokit-avm-vscode-debugger/.releaserc.json) with custom release rules
   - Opportunity: Template for other TypeScript/VSCode extension projects
   - Includes semantic-release-vsce integration for marketplace packaging

3. **VSCode E2E testing setup**
   - Evidence: WebdriverIO with wdio-vscode-service at [test/wdio.conf.ts](../../../algokit-avm-vscode-debugger/test/wdio.conf.ts)
   - Opportunity: Standardize E2E testing approach for VSCode extensions
   - Unique setup with xvfb for headless testing (Evidence: [build-and-test.yaml:65-67](../../../algokit-avm-vscode-debugger/build-and-test.yaml#L65-L67))

4. **Node.js version consolidation**
   - Opportunity: Create .nvmrc file, reference in workflows via setup-node's node-version-file input
   - Benefit: Single source of truth for runtime version

5. **Coverage configuration template**
   - Opportunity: Standard vitest coverage config with reasonable thresholds (e.g., 80% lines, 75% branches)
   - Benefit: Consistent quality standards across TypeScript projects

### 7.4 Unique Patterns (Non-Issues)

1. **Dual testing framework approach** (Vitest + WebdriverIO)
   - Evidence: [vitest.config.ts](../../../algokit-avm-vscode-debugger/vitest.config.ts) for unit tests, [test/wdio.conf.ts](../../../algokit-avm-vscode-debugger/test/wdio.conf.ts) for E2E
   - Justification: VSCode extensions require specialized E2E testing in extension host environment
   - Pattern: wdio-vscode-service enables real VSCode extension testing
   - Appropriate for VSCode extension category

2. **Beta-by-default release strategy**
   - Evidence: Main branch configured as beta prerelease at [.releaserc.json:3-6](../../../algokit-avm-vscode-debugger/.releaserc.json#L3-L6)
   - Justification: Allows testing releases before marketplace publication
   - Manual production release gate prevents accidental marketplace publish (Evidence: [cd.yaml:70-74](../../../algokit-avm-vscode-debugger/cd.yaml#L70-L74))
   - Appropriate for VSCode extension with marketplace publishing

3. **VSIX packaging without automatic publish**
   - Evidence: semantic-release-vsce with `publish: false` at [.releaserc.json:58-60](../../../algokit-avm-vscode-debugger/.releaserc.json#L58-L60)
   - Justification: Separates VSIX creation from marketplace publication
   - Allows testing VSIX artifacts before public release
   - Manual publish step adds quality gate (Evidence: [cd.yaml:70-74](../../../algokit-avm-vscode-debugger/cd.yaml#L70-L74))

4. **Cross-platform E2E testing**
   - Evidence: Test matrix includes ubuntu-latest and windows-latest at [build-and-test.yaml:41-42](../../../algokit-avm-vscode-debugger/build-and-test.yaml#L41-L42)
   - Justification: VSCode extensions must work across platforms
   - Appropriate for VSCode extension category

5. **Non-standard branch name "do-not-delete"**
   - Evidence: [.releaserc.json:7-9](../../../algokit-avm-vscode-debugger/.releaserc.json#L7-L9)
   - Observation: Unusual but functional branch name for production releases
   - Not a technical issue but could be more descriptive (e.g., "production" or "stable")

---

## 8. Evidence Summary

- **Total Files Analyzed**: 27
- **Key Evidence Files**:
  - [package.json:1-242](../../../algokit-avm-vscode-debugger/package.json) (version, scripts, dependencies, VSCode extension configuration)
  - [.releaserc.json:1-73](../../../algokit-avm-vscode-debugger/.releaserc.json) (semantic-release configuration with beta/production branches)
  - [.github/workflows/build-and-test.yaml:1-68](../../../algokit-avm-vscode-debugger/.github/workflows/build-and-test.yaml) (reusable CI workflow with matrix testing)
  - [.github/workflows/cd.yaml:1-75](../../../algokit-avm-vscode-debugger/.github/workflows/cd.yaml) (dual-mode release automation)
  - [.github/workflows/pr.yaml:1-14](../../../algokit-avm-vscode-debugger/.github/workflows/pr.yaml) (PR validation trigger)
  - [vitest.config.ts:1-10](../../../algokit-avm-vscode-debugger/vitest.config.ts) (unit test configuration, no coverage)
  - [test/wdio.conf.ts:1-43](../../../algokit-avm-vscode-debugger/test/wdio.conf.ts) (E2E test configuration with VSCode service)
  - [tsconfig.json:1-10](../../../algokit-avm-vscode-debugger/tsconfig.json) (TypeScript configuration)
  - [README.md:1-249](../../../algokit-avm-vscode-debugger/README.md) (comprehensive user documentation)
  - [CONTRIBUTING.md:1-70](../../../algokit-avm-vscode-debugger/CONTRIBUTING.md) (developer guide with commit conventions)
  - [src/utils.spec.ts](../../../algokit-avm-vscode-debugger/src/utils.spec.ts) (unit test example)
  - [test/src/extension.spec.ts:1-214](../../../algokit-avm-vscode-debugger/test/src/extension.spec.ts) (E2E test suite)

---

## 9. Category Alignment Assessment

**Expected Pattern for VSCode Extension (Category 7)**:
- ✅ VSCode extension manifest in package.json (activationEvents, contributes)
- ✅ Extension packaging via .vsix format (semantic-release-vsce)
- ✅ VSCode-specific testing (wdio-vscode-service)
- ✅ Marketplace publishing workflow
- ⚠️ Coverage configuration missing (common in extension projects but still a gap)
- ✅ Cross-platform testing (ubuntu, windows)
- ✅ TypeScript with bundling (esbuild)

**Alignment**: Strong alignment with VSCode extension category expectations. Unique dual-mode release strategy is appropriate for controlled marketplace publishing.

---

**Analysis Completed**: 2025-12-23
**Analyzer**: Claude Code (following Single Repository Analysis Plan)
**Repository**: algokit-avm-vscode-debugger
**Category**: VSCode Extension (Category 7)
