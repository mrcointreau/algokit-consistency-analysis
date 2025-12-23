# Repository Analysis: algorand-typescript-testing

## 1. Repository Overview
- **Tech Stack**: TypeScript
- **Purpose Category**: TypeScript Library (Testing Framework)
- **Monorepo**: No
- **Signal Files**:
  - Configuration: [package.json](../../../algorand-typescript-testing/package.json), [tsconfig.json](../../../algorand-typescript-testing/tsconfig.json), [tsconfig.build.json](../../../algorand-typescript-testing/tsconfig.build.json)
  - CI/CD: [.github/workflows/pr.yml](../../../algorand-typescript-testing/.github/workflows/pr.yml), [.github/workflows/node-ci.yml](../../../algorand-typescript-testing/.github/workflows/node-ci.yml), [.github/workflows/release.yml](../../../algorand-typescript-testing/.github/workflows/release.yml), [.github/workflows/prod-release.yml](../../../algorand-typescript-testing/.github/workflows/prod-release.yml), [.github/workflows/gh-pages.yml](../../../algorand-typescript-testing/.github/workflows/gh-pages.yml)
  - Release: [.releaserc.json](../../../algorand-typescript-testing/.releaserc.json)
  - Commit Conventions: [commitlint.config.cjs](../../../algorand-typescript-testing/commitlint.config.cjs)
  - Testing: [vitest.config.mts](../../../algorand-typescript-testing/vitest.config.mts), [vitest.setup.ts](../../../algorand-typescript-testing/vitest.setup.ts), tests/
  - Documentation: [typedoc.json](../../../algorand-typescript-testing/typedoc.json), docs/
  - Build: [rollup.config.ts](../../../algorand-typescript-testing/rollup.config.ts), [eslint.config.mjs](../../../algorand-typescript-testing/eslint.config.mjs)

---

## 2. CI/CD Findings

### 2.1 Workflow Inventory
| Workflow File | Purpose | Triggers |
|---------------|---------|----------|
| [pr.yml](../../../algorand-typescript-testing/.github/workflows/pr.yml#L1-L28) | PR validation | pull_request on main, alpha (excluding docs/**, scripts/**) |
| [node-ci.yml](../../../algorand-typescript-testing/.github/workflows/node-ci.yml#L1-L180) | Reusable CI workflow | workflow_call |
| [release.yml](../../../algorand-typescript-testing/.github/workflows/release.yml#L1-L86) | Automated release | push to alpha, main, release; workflow_dispatch |
| [prod-release.yml](../../../algorand-typescript-testing/.github/workflows/prod-release.yml#L1-L45) | Production release merge | workflow_dispatch |
| [gh-pages.yml](../../../algorand-typescript-testing/.github/workflows/gh-pages.yml#L1-L36) | Documentation publishing | workflow_call, workflow_dispatch |

### 2.2 Third-Party Actions
| Action | Version | Used In | Pinned |
|--------|---------|---------|--------|
| actions/checkout | v4 | All workflows | **No** (tag-based) |
| actions/setup-node | v4 | node-ci.yml, release.yml, gh-pages.yml | **No** (tag-based) |
| actions/download-artifact | v4 | node-ci.yml, release.yml | **No** (tag-based) |
| actions/upload-artifact | v4 | node-ci.yml | **No** (tag-based) |
| actions/create-github-app-token | v1 | release.yml, prod-release.yml | **No** (tag-based) |
| phoenix-actions/test-reporting | v10 | node-ci.yml | **No** (tag-based) |
| JS-DevTools/npm-publish | v3 | release.yml | **No** (tag-based) |
| actions/upload-pages-artifact | v3 | gh-pages.yml | **No** (tag-based) |
| actions/deploy-pages | v4 | gh-pages.yml | **No** (tag-based) |
| devmasx/merge-branch | 6ec8363d74aad4f1615d1234ae1908b4185c4313 | prod-release.yml | **Yes** (commit SHA) |

**SECURITY FINDINGS**:
- **HIGH PRIORITY**: 9 out of 10 third-party actions are pinned to mutable tags (v1, v3, v4, v10) instead of immutable commit SHAs
- **Supply chain security risk**: Tag-based pinning allows malicious updates without code review
- **Exception**: devmasx/merge-branch@6ec8363d74aad4f1615d1234ae1908b4185c4313 is properly pinned to commit SHA (Evidence: [prod-release.yml:30](../../../algorand-typescript-testing/.github/workflows/prod-release.yml#L30))

### 2.3 Runtime Versions
- **Node Version**: 22.x (Source: hardcoded in workflows - Evidence: [pr.yml:24](../../../algorand-typescript-testing/.github/workflows/pr.yml#L24), [release.yml:27](../../../algorand-typescript-testing/.github/workflows/release.yml#L27), [gh-pages.yml:21](../../../algorand-typescript-testing/.github/workflows/gh-pages.yml#L21))
- **Node Version (Reusable Workflow Default)**: 18.x (Source: hardcoded default in node-ci.yml - Evidence: [node-ci.yml:7](../../../algorand-typescript-testing/.github/workflows/node-ci.yml#L7))
- **Python Version**: 3.12.6 (Source: hardcoded in pr.yml pre-test-script - Evidence: [pr.yml:21](../../../algorand-typescript-testing/.github/workflows/pr.yml#L21))
- **No version files found**: No .nvmrc, .node-version, or .python-version files present

### 2.4 Release Automation
- **Mechanism**: semantic-release (Evidence: [release.yml:65](../../../algorand-typescript-testing/.github/workflows/release.yml#L65))
- **Triggers**: Automated on push to alpha, main, release branches; manual via workflow_dispatch (Evidence: [release.yml:4-9](../../../algorand-typescript-testing/.github/workflows/release.yml#L4-L9))
- **Publishing**: Automated npm publish to public registry via JS-DevTools/npm-publish (Evidence: [release.yml:70-75](../../../algorand-typescript-testing/.github/workflows/release.yml#L70-L75))
- **Tag Strategy**: Dynamic based on branch (alpha → alpha tag, main → beta tag, release → latest tag) (Evidence: [release.yml:75](../../../algorand-typescript-testing/.github/workflows/release.yml#L75))

### 2.5 CI/CD Gaps & Anomalies
1. **Reusable workflow pattern**: node-ci.yml is a parameterized reusable workflow called by pr.yml and release.yml, which promotes consistency (Evidence: [pr.yml:18](../../../algorand-typescript-testing/.github/workflows/pr.yml#L18), [release.yml:21](../../../algorand-typescript-testing/.github/workflows/release.yml#L21))
2. **Pre-test dependencies**: Tests require AlgoKit and PuyaPy installation via pipx (Evidence: [pr.yml:20-23](../../../algorand-typescript-testing/.github/workflows/pr.yml#L20-L23))
3. **Build artifact handling**: release.yml builds dist, uploads as artifact, downloads in release job for npm publish (Evidence: [release.yml:31-32](../../../algorand-typescript-testing/.github/workflows/release.yml#L31-L32), [release.yml:59-62](../../../algorand-typescript-testing/.github/workflows/release.yml#L59-L62))
4. **Hardcoded runtime versions**: No version files (.nvmrc, .python-version), all versions hardcoded in workflows
5. **Node version inconsistency**: Reusable workflow defaults to 18.x but callers override to 22.x (Evidence: [node-ci.yml:7](../../../algorand-typescript-testing/.github/workflows/node-ci.yml#L7) vs [pr.yml:24](../../../algorand-typescript-testing/.github/workflows/pr.yml#L24))
6. **GitHub App token usage**: Uses GitHub App token for releases to bypass rate limits and enable workflow triggers (Evidence: [release.yml:39-44](../../../algorand-typescript-testing/.github/workflows/release.yml#L39-L44))
7. **Security audit**: Runs npm audit via better-npm-audit (Evidence: [pr.yml:27](../../../algorand-typescript-testing/.github/workflows/pr.yml#L27))

---

## 3. Branching Strategy Findings

### 3.1 Branch Triggers
| Workflow | Branches | Tags | Purpose |
|----------|----------|------|---------|
| pr.yml | main, alpha | N/A | PR validation before merge |
| release.yml | alpha, main, release | N/A | Automated release on push |
| prod-release.yml | N/A | N/A | Manual production release (merges main → release → main) |
| gh-pages.yml | N/A | N/A | Called by release.yml after release branch publish |

### 3.2 Commit Conventions
- **Commitlint**: Yes (Config: conventional with custom rules - Evidence: [commitlint.config.cjs:1-15](../../../algorand-typescript-testing/commitlint.config.cjs#L1-L15))
- **Pre-commit Hooks**: No (No .pre-commit-config.yaml found)
- **CI Enforcement**: Yes (run-commit-lint: true in pr.yml and release.yml - Evidence: [pr.yml:26](../../../algorand-typescript-testing/.github/workflows/pr.yml#L26))
- **Custom Rules**: Subject case allows pascal-case and upper-case, flexible header/body/footer length limits (Evidence: [commitlint.config.cjs:5-12](../../../algorand-typescript-testing/commitlint.config.cjs#L5-L12))

### 3.3 Release Branch Strategy
- **Semantic-Release Branches**: [main (prerelease: beta), release, alpha (prerelease: alpha)] (Evidence: [.releaserc.json:2-14](../../../algorand-typescript-testing/.releaserc.json#L2-L14))
- **Environment Branches**: None
- **Branch-to-Tag Mapping**:
  - alpha branch → alpha npm tag (Evidence: [release.yml:75](../../../algorand-typescript-testing/.github/workflows/release.yml#L75))
  - main branch → beta npm tag (Evidence: [release.yml:75](../../../algorand-typescript-testing/.github/workflows/release.yml#L75))
  - release branch → latest npm tag (Evidence: [release.yml:75](../../../algorand-typescript-testing/.github/workflows/release.yml#L75))

### 3.4 Trunk-Based Compliance
- **Assessment**: Partially compliant (multi-branch release strategy)
- **Evidence**: Uses three long-lived branches (main, alpha, release) for different release channels
- **Pattern**: main serves as beta channel, release branch for stable/production releases
- **Production release process**: Manual workflow merges main → release → main to promote beta to stable (Evidence: [prod-release.yml:29-44](../../../algorand-typescript-testing/.github/workflows/prod-release.yml#L29-L44))
- **Deviation from trunk-based**: Multiple long-lived release branches instead of single trunk with feature flags

---

## 4. Release & Versioning Findings

### 4.1 Release Mechanism
- **Tool**: semantic-release (Evidence: [package.json:60](../../../algorand-typescript-testing/package.json#L60), [.releaserc.json](../../../algorand-typescript-testing/.releaserc.json))
- **Config File**: [.releaserc.json](../../../algorand-typescript-testing/.releaserc.json)
- **Automation Level**: Fully automated (semantic-release generates version, changelog, GitHub release, npm publish)

### 4.2 Tag Format
- **Format**: Standard semantic versioning (inferred from semantic-release usage)
- **Source**: semantic-release with conventional commits (Evidence: [.releaserc.json:17-34](../../../algorand-typescript-testing/.releaserc.json#L17-L34))
- **Custom Release Rules**: build, chore, and refactor commits trigger patch releases (Evidence: [.releaserc.json:21-32](../../../algorand-typescript-testing/.releaserc.json#L21-L32))

### 4.3 Version Sources
| File | Field | Current Value | Role |
|------|-------|---------------|------|
| [package.json:3](../../../algorand-typescript-testing/package.json#L3) | version | 1.0.0 | Source of truth (updated by semantic-release) |

### 4.4 Version Propagation
- **Auto-commit**: Yes (By: semantic-release via GitHub App token - Evidence: [release.yml:39-50](../../../algorand-typescript-testing/.github/workflows/release.yml#L39-L50))
- **Lockfile Updates**: Automatic (package-lock.json committed to repo)
- **Build Artifact**: Package published from artifacts/algo-ts-testing (Evidence: [release.yml:73](../../../algorand-typescript-testing/.github/workflows/release.yml#L73))
- **NPM Publish**: npmPublish set to false in semantic-release, actual publish done separately via JS-DevTools/npm-publish (Evidence: [.releaserc.json:62](../../../algorand-typescript-testing/.releaserc.json#L62), [release.yml:70-75](../../../algorand-typescript-testing/.github/workflows/release.yml#L70-L75))

### 4.5 Monorepo Version Strategy (if applicable)
- **N/A**: Not a monorepo

### 4.6 Versioning Gaps or Inconsistencies
- **Unique pattern**: Publishes from artifacts/algo-ts-testing instead of root dist directory (Evidence: [.releaserc.json:63](../../../algorand-typescript-testing/.releaserc.json#L63))
- **Split responsibility**: semantic-release handles versioning/tagging, separate action handles npm publish
- **No version export in code**: No __version__ or VERSION export found in [src/index.ts:1-6](../../../algorand-typescript-testing/src/index.ts#L1-L6)

---

## 5. Testing Strategy Findings

### 5.1 Test Framework
- **Framework**: vitest (Evidence: [package.json:68](../../../algorand-typescript-testing/package.json#L68), [vitest.config.mts](../../../algorand-typescript-testing/vitest.config.mts))
- **Config File**: [vitest.config.mts](../../../algorand-typescript-testing/vitest.config.mts)
- **Custom Transformer**: Uses custom puyaTsTransformer for test execution (Evidence: [vitest.config.mts:3](../../../algorand-typescript-testing/ vitest.config.mts#L3), [vitest.config.mts:15](../../../algorand-typescript-testing/vitest.config.mts#L15))

### 5.2 Coverage Configuration
- **Tool**: @vitest/coverage-v8 (Evidence: [package.json:48](../../../algorand-typescript-testing/package.json#L48))
- **Thresholds**: None configured (no coverage thresholds in vitest.config.mts)
- **Reporting**: Default vitest coverage reporting (lcov/html inferred from standard vitest behavior)
- **Script**: npm run test:coverage (Evidence: [package.json:22](../../../algorand-typescript-testing/package.json#L22))

### 5.3 Test Structure
- **Separation**: All tests mixed in tests/ directory
- **File Patterns**: *.algo.spec.ts (Evidence: tests/native-mutable-object.algo.spec.ts, tests/arc4/encode-decode-arc4.algo.spec.ts)
- **Special categories**:
  - ARC4 type tests (tests/arc4/)
  - Native type tests (tests/native-*)
  - Test artifacts directory (tests/artifacts/)
- **Setup**: Global test setup in vitest.setup.ts (Evidence: [vitest.config.mts:8](../../../algorand-typescript-testing/vitest.config.mts#L8))

### 5.4 CI Enforcement
- **Test Execution**: Yes (In workflow: node-ci.yml via test-script input - Evidence: [node-ci.yml:147-149](../../../algorand-typescript-testing/.github/workflows/node-ci.yml#L147-L149))
- **Coverage Enforcement**: No (No --cov-fail-under or threshold enforcement)
- **CI Test Script**: npm run test:ci with coverage, junit reporter (Evidence: [package.json:23](../../../algorand-typescript-testing/package.json#L23))
- **Matrix Testing**: No (Single Node 22.x version only)

### 5.5 Testing Gaps
1. **No coverage thresholds**: Coverage is collected (Evidence: [package.json:22-23](../../../algorand-typescript-testing/package.json#L22-L23)) but not enforced with minimum thresholds
2. **No coverage enforcement in CI**: Tests run with coverage in CI but no fail-on-low-coverage mechanism
3. **No matrix testing**: Only tests against Node 22.x, not multiple Node versions
4. **Test reporting configured but unused**: phoenix-actions/test-reporting is in node-ci.yml but output-test-results defaults to false (Evidence: [node-ci.yml:32-34](../../../algorand-typescript-testing/.github/workflows/node-ci.yml#L32-L34), [node-ci.yml:152-160](../../../algorand-typescript-testing/.github/workflows/node-ci.yml#L152-L160))

---

## 6. Documentation Findings

### 6.1 Documentation Tooling
- **Tool**: TypeDoc (Evidence: [package.json:63](../../../algorand-typescript-testing/package.json#L63), [typedoc.json](../../../algorand-typescript-testing/typedoc.json))
- **Config File**: [typedoc.json](../../../algorand-typescript-testing/typedoc.json)

### 6.2 Generation Settings
- **Theme**: Default TypeDoc theme (no custom theme specified)
- **Extensions**: typedoc-plugin-missing-exports, typedoc-plugin-markdown (Evidence: [typedoc.json:23](../../../algorand-typescript-testing/typedoc.json#L23))
- **Entry Points**: Multiple entry points for main API, transformers, and value generators (Evidence: [typedoc.json:3-8](../../../algorand-typescript-testing/typedoc.json#L3-L8))
- **Output**: HTML output to docs/_html (Evidence: [typedoc.json:15-19](../../../algorand-typescript-testing/typedoc.json#L15-L19))
- **Project Documents**: Includes multiple markdown guides (testing-guide.md, algots.md, api.md, coverage.md, examples.md, faq.md) (Evidence: [typedoc.json:22](../../../algorand-typescript-testing/typedoc.json#L22))
- **Build Command**: npm run script:documentation (Evidence: [package.json:24](../../../algorand-typescript-testing/package.json#L24))

### 6.3 Publishing Automation
- **Hosting**: GitHub Pages (Evidence: [gh-pages.yml:30-35](../../../algorand-typescript-testing/.github/workflows/gh-pages.yml#L30-L35))
- **Workflow**: [gh-pages.yml](../../../algorand-typescript-testing/.github/workflows/gh-pages.yml)
- **Triggers**: Called by release.yml after release branch publish, also manual workflow_dispatch (Evidence: [gh-pages.yml:3-5](../../../algorand-typescript-testing/.github/workflows/gh-pages.yml#L3-L5), [release.yml:77-85](../../../algorand-typescript-testing/.github/workflows/release.yml#L77-L85))
- **Automation**: Fully automated - builds TypeDoc and deploys to GitHub Pages on production releases (Evidence: [release.yml:80](../../../algorand-typescript-testing/.github/workflows/release.yml#L80))

### 6.4 Documentation Structure
- **API Docs**: Yes (TypeDoc auto-generated from TypeScript types and JSDoc comments)
- **Guides/Tutorials**: Yes (Extensive markdown guides in docs/)
  - testing-guide.md
  - tg-application-spy.md
  - tg-arc4-types.md
  - tg-avm-types.md
  - tg-concepts.md
  - tg-contract-testing.md
  - tg-opcodes.md
  - tg-signature-testing.md
  - tg-state-management.md
  - tg-transactions.md
- **Examples**: Yes (examples.md guide + examples/ directory - Evidence: [package.json:25-27](../../../algorand-typescript-testing/package.json#L25-L27))
- **Architecture Docs**: Yes (algots.md, api.md, coverage.md, faq.md)

### 6.5 Documentation Gaps
- **None identified**: Comprehensive documentation strategy with automated publishing, extensive guides, and API documentation

---

## 7. Gaps, Risks, and Observations

### 7.1 Critical Gaps
1. **No coverage thresholds enforced** (Evidence: [vitest.config.mts](../../../algorand-typescript-testing/vitest.config.mts) has no coverage configuration)
   - Coverage is collected but not enforced, risking quality degradation over time

2. **No runtime version files** (Evidence: No .nvmrc or .python-version files)
   - Hardcoded versions in workflows make it harder to ensure local dev environment matches CI

### 7.2 Risks

**HIGH PRIORITY - Security Risks:**
1. **Unpinned GitHub Actions** (Evidence: 9/10 actions use mutable tags in [workflows](../../../algorand-typescript-testing/.github/workflows/))
   - Supply chain attack vector: Tag-based references allow malicious updates
   - Impact: Code execution in CI/CD pipeline with repository write access
   - Recommendation: Pin all actions to commit SHAs

**MEDIUM PRIORITY - Reliability Risks:**
2. **No coverage enforcement** (Evidence: [package.json:22-23](../../../algorand-typescript-testing/package.json#L22-L23) has coverage scripts but [vitest.config.mts](../../../algorand-typescript-testing/vitest.config.mts) has no thresholds)
   - Tests run without minimum coverage requirements
   - Risk: Coverage degradation over time

3. **Complex branching strategy** (Evidence: [.releaserc.json:2-14](../../../algorand-typescript-testing/.releaserc.json#L2-L14))
   - Three long-lived branches (main, alpha, release) with manual promotion
   - Risk: Merge conflicts, complexity in release process
   - prod-release.yml performs bidirectional merges (Evidence: [prod-release.yml:29-44](../../../algorand-typescript-testing/.github/workflows/prod-release.yml#L29-L44))

4. **Hardcoded runtime versions** (Evidence: [pr.yml:21](../../../algorand-typescript-testing/.github/workflows/pr.yml#L21), [pr.yml:24](../../../algorand-typescript-testing/.github/workflows/pr.yml#L24))
   - Python 3.12.6 and Node 22.x hardcoded in workflows
   - Risk: Version drift between CI and local development

**LOW PRIORITY - Maintainability:**
5. **Node version inconsistency** (Evidence: [node-ci.yml:7](../../../algorand-typescript-testing/.github/workflows/node-ci.yml#L7) defaults to 18.x, but callers use 22.x)
   - Reusable workflow has outdated default
   - Not a runtime issue since callers override, but creates confusion

### 7.3 Standardization Opportunities
1. **Reusable node-ci.yml workflow**: Already implements reusable workflow pattern (Evidence: [node-ci.yml:1](../../../algorand-typescript-testing/.github/workflows/node-ci.yml#L1))
   - Could be promoted to .github repository for cross-repo reuse
   - Parameterized design supports diverse Node.js projects

2. **Commitlint configuration**: Standard conventional commits with custom rules (Evidence: [commitlint.config.cjs](../../../algorand-typescript-testing/commitlint.config.cjs))
   - Could be templated for other TypeScript repos

3. **TypeDoc configuration**: Comprehensive TypeDoc setup with plugins and project documents (Evidence: [typedoc.json](../../../algorand-typescript-testing/typedoc.json))
   - Could serve as template for other TypeScript library documentation

4. **GitHub App token pattern**: Uses GitHub App for semantic-release to enable workflow triggers (Evidence: [release.yml:39-50](../../../algorand-typescript-testing/.github/workflows/release.yml#L39-L50))
   - Best practice pattern for repos needing to trigger workflows from bot commits

### 7.4 Unique Patterns (Non-Issues)
1. **Custom Vitest transformer** (Evidence: [vitest.config.mts:3](../../../algorand-typescript-testing/ vitest.config.mts#L3), [vitest.config.mts:14-17](../../../algorand-typescript-testing/vitest.config.mts#L14-L17))
   - Uses puyaTsTransformer for test-time TypeScript compilation
   - Legitimate requirement for testing framework that needs to transform Algorand TypeScript

2. **Triple-branch release strategy** (Evidence: [.releaserc.json:2-14](../../../algorand-typescript-testing/.releaserc.json#L2-L14))
   - alpha → main → release progression allows thorough beta testing
   - Appropriate for library with stability requirements
   - Main branch is beta prerelease, release branch is stable

3. **Pre-test AlgoKit and PuyaPy installation** (Evidence: [pr.yml:20-23](../../../algorand-typescript-testing/.github/workflows/pr.yml#L20-L23))
   - Tests require AlgoKit localnet and PuyaPy compiler
   - Necessary for testing framework that emulates AVM behavior

4. **Artifact-based npm publish** (Evidence: [.releaserc.json:62-64](../../../algorand-typescript-testing/.releaserc.json#L62-L64), [release.yml:31-32](../../../algorand-typescript-testing/.github/workflows/release.yml#L31-L32))
   - Publishes from artifacts/algo-ts-testing instead of root
   - Build step copies package.json to dist (Evidence: [package.json:18](../../../algorand-typescript-testing/package.json#L18))

5. **Path ignore for docs/** in PR workflow** (Evidence: [pr.yml:8-10](../../../algorand-typescript-testing/.github/workflows/pr.yml#L8-L10))
   - Skips CI for documentation-only changes
   - Reasonable optimization since docs publish separately on release

6. **Split semantic-release and npm publish** (Evidence: [.releaserc.json:62](../../../algorand-typescript-testing/.releaserc.json#L62) sets npmPublish: false, [release.yml:70-75](../../../algorand-typescript-testing/.github/workflows/release.yml#L70-L75) does separate publish)
   - Allows dynamic npm tag based on branch (alpha/beta/latest)
   - More flexible than semantic-release's built-in npm plugin

---

## 8. Evidence Summary
- **Total Files Analyzed**: 17
- **Key Evidence Files**:
  - [package.json:1-85](../../../algorand-typescript-testing/package.json#L1-L85) (for dependencies, scripts, version)
  - [.releaserc.json:1-68](../../../algorand-typescript-testing/.releaserc.json#L1-L68) (for release strategy)
  - [commitlint.config.cjs:1-15](../../../algorand-typescript-testing/commitlint.config.cjs#L1-L15) (for commit conventions)
  - [.github/workflows/pr.yml:1-28](../../../algorand-typescript-testing/.github/workflows/pr.yml#L1-L28) (for PR validation)
  - [.github/workflows/node-ci.yml:1-180](../../../algorand-typescript-testing/.github/workflows/node-ci.yml#L1-L180) (for reusable CI workflow)
  - [.github/workflows/release.yml:1-86](../../../algorand-typescript-testing/.github/workflows/release.yml#L1-L86) (for automated releases)
  - [.github/workflows/prod-release.yml:1-45](../../../algorand-typescript-testing/.github/workflows/prod-release.yml#L1-L45) (for production promotion)
  - [.github/workflows/gh-pages.yml:1-36](../../../algorand-typescript-testing/.github/workflows/gh-pages.yml#L1-L36) (for documentation publishing)
  - [vitest.config.mts:1-20](../../../algorand-typescript-testing/vitest.config.mts#L1-L20) (for test configuration)
  - [typedoc.json:1-28](../../../algorand-typescript-testing/typedoc.json#L1-L28) (for documentation generation)
  - [src/index.ts:1-6](../../../algorand-typescript-testing/src/index.ts#L1-L6) (for exports)
  - [tsconfig.json](../../../algorand-typescript-testing/tsconfig.json) (for TypeScript configuration)
  - [rollup.config.ts](../../../algorand-typescript-testing/rollup.config.ts) (for build configuration)
  - [eslint.config.mjs](../../../algorand-typescript-testing/eslint.config.mjs) (for linting)
  - [.prettierrc.cjs](../../../algorand-typescript-testing/.prettierrc.cjs) (for code formatting)
  - [.editorconfig](../../../algorand-typescript-testing/.editorconfig) (for editor configuration)
  - docs/ directory (for comprehensive documentation guides)
