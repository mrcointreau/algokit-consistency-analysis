# Repository Analysis: puya-ts

## 1. Repository Overview
- **Tech Stack**: TypeScript
- **Purpose Category**: TypeScript CLI Tool (Compiler)
- **Monorepo**: Yes (2 packages: @algorandfoundation/puya-ts, @algorandfoundation/algorand-typescript)
- **Signal Files**:
  - CI/CD: [.github/workflows/pr.yml](../../../puya-ts/.github/workflows/pr.yml), [.github/workflows/release.yml](../../../puya-ts/.github/workflows/release.yml), [.github/workflows/prod-release.yml](../../../puya-ts/.github/workflows/prod-release.yml), [.github/workflows/ci-all.yml](../../../puya-ts/.github/workflows/ci-all.yml), [.github/workflows/node-ci.yml](../../../puya-ts/.github/workflows/node-ci.yml), [.github/workflows/gh-pages.yml](../../../puya-ts/.github/workflows/gh-pages.yml)
  - Release: [.releaserc.json](../../../puya-ts/.releaserc.json)
  - Versioning: [package.json](../../../puya-ts/package.json), [packages/algo-ts/package.json](../../../puya-ts/packages/algo-ts/package.json)
  - Testing: [tests/](../../../puya-ts/tests/), [vitest.config.mts](../../../puya-ts/vitest.config.mts)
  - Documentation: [docs/](../../../puya-ts/docs/), [typedoc.json](../../../puya-ts/typedoc.json)
  - Branching: [commitlint.config.cjs](../../../puya-ts/commitlint.config.cjs)

---

## 2. CI/CD Findings

### 2.1 Workflow Inventory
| Workflow File | Purpose | Triggers |
|---------------|---------|----------|
| [pr.yml](../../../puya-ts/.github/workflows/pr.yml) | PR validation | pull_request on main, alpha |
| [release.yml](../../../puya-ts/.github/workflows/release.yml) | Automated release and publish | push to alpha, main, release; workflow_dispatch |
| [prod-release.yml](../../../puya-ts/.github/workflows/prod-release.yml) | Production release promotion | workflow_dispatch |
| [ci-all.yml](../../../puya-ts/.github/workflows/ci-all.yml) | Reusable workflow for building both packages | workflow_call |
| [node-ci.yml](../../../puya-ts/.github/workflows/node-ci.yml) | Reusable workflow for Node.js CI | workflow_call |
| [gh-pages.yml](../../../puya-ts/.github/workflows/gh-pages.yml) | Documentation publishing | workflow_call, workflow_dispatch |

### 2.2 Third-Party Actions
| Action | Version | Used In | Pinned |
|--------|---------|---------|--------|
| actions/create-github-app-token | v1 | release.yml, prod-release.yml | ⚠️ No (tag) |
| actions/checkout | v4 | All workflows | ⚠️ No (tag) |
| actions/setup-node | v4 | node-ci.yml, release.yml, gh-pages.yml | ⚠️ No (tag) |
| actions/setup-python | v5 | node-ci.yml | ⚠️ No (tag) |
| actions/download-artifact | v4 | node-ci.yml, release.yml | ⚠️ No (tag) |
| actions/upload-artifact | v4 | node-ci.yml | ⚠️ No (tag) |
| actions/upload-pages-artifact | v3 | gh-pages.yml | ⚠️ No (tag) |
| actions/deploy-pages | v4 | gh-pages.yml | ⚠️ No (tag) |
| phoenix-actions/test-reporting | v15 | node-ci.yml | ⚠️ No (tag) |
| JS-DevTools/npm-publish | v3 | release.yml | ⚠️ No (tag) |
| devmasx/merge-branch | 6ec8363d74aad4f1615d1234ae1908b4185c4313 | prod-release.yml | ✅ Yes (commit SHA) |

**SECURITY FINDINGS**:
- **HIGH PRIORITY**: 10 out of 11 third-party actions are pinned to tags (v1, v3, v4, v5, v15) instead of immutable commit SHAs
- This represents a supply chain security risk as tags can be moved or deleted
- Only devmasx/merge-branch is properly pinned to a commit SHA (Evidence: [prod-release.yml:30](../../../puya-ts/.github/workflows/prod-release.yml#L30), [prod-release.yml:38](../../../puya-ts/.github/workflows/prod-release.yml#L38))

### 2.3 Runtime Versions
- **Node Version**: 20.x, 22.x, 24.x (Source: hardcoded in workflow matrix at [ci-all.yml:14](../../../puya-ts/.github/workflows/ci-all.yml#L14), [ci-all.yml:30](../../../puya-ts/.github/workflows/ci-all.yml#L30))
- **Python Version**: 3.12.6 (Source: hardcoded at [ci-all.yml:37](../../../puya-ts/.github/workflows/ci-all.yml#L37))
- **No .nvmrc or package.json engines field found**

### 2.4 Release Automation
- **Mechanism**: semantic-release for versioning, manual npm publish via JS-DevTools/npm-publish action
- **Triggers**: Automated on push to alpha, main, release branches (Evidence: [release.yml:4-8](../../../puya-ts/.github/workflows/release.yml#L4-L8))
- **Release Flow**:
  1. CI builds and tests both packages
  2. semantic-release generates version for @algorandfoundation/puya-ts
  3. Version is copied to @algorandfoundation/algorand-typescript
  4. Both packages published to npm with appropriate dist-tags (Evidence: [release.yml:67-91](../../../puya-ts/.github/workflows/release.yml#L67-L91))

### 2.5 CI/CD Gaps & Anomalies
- **Complex multi-branch release strategy**: Uses alpha (prerelease), main (beta), and release (latest) branches with manual promotion workflow
- **Monorepo version synchronization**: Custom script copies version from puya-ts to algo-ts (Evidence: [release.yml:67-73](../../../puya-ts/.github/workflows/release.yml#L67-L73))
- **Production release requires manual workflow_dispatch**: [prod-release.yml](../../../puya-ts/.github/workflows/prod-release.yml) merges main→release→main
- **Python dependency for tests**: Requires algokit and localnet for test execution (Evidence: [ci-all.yml:38-40](../../../puya-ts/.github/workflows/ci-all.yml#L38-L40))
- **No automated security scanning** (e.g., CodeQL, Dependabot config visible)

---

## 3. Branching Strategy Findings

### 3.1 Branch Triggers
| Workflow | Branches | Tags | Purpose |
|----------|----------|------|---------|
| pr.yml | main, alpha | - | PR validation |
| release.yml | alpha, main, release | - | Automated release and publish |
| prod-release.yml | - | - | Manual promotion (workflow_dispatch) |

### 3.2 Commit Conventions
- **Commitlint**: Yes (Config: conventional with custom rules at [commitlint.config.cjs](../../../puya-ts/commitlint.config.cjs))
- **Pre-commit Hooks**: No (.pre-commit-config.yaml not found)
- **CI Enforcement**: Yes, commitlint runs on PR validation (Evidence: [pr.yml:18](../../../puya-ts/.github/workflows/pr.yml#L18), [ci-all.yml:32](../../../puya-ts/.github/workflows/ci-all.yml#L32))

### 3.3 Release Branch Strategy
- **Semantic-Release Branches**: [main (beta prerelease), release (latest), alpha (alpha prerelease)] (Evidence: [.releaserc.json:2-14](../../../puya-ts/.releaserc.json#L2-L14))
- **Environment Branches**: None for deployment; release branches serve as dist-tag indicators

### 3.4 Trunk-Based Compliance
- **Assessment**: Partially compliant
- **Evidence**:
  - Uses multiple long-lived branches (alpha, main, release)
  - Main is treated as beta prerelease, not stable
  - Requires manual promotion workflow to move from main→release for production
  - This is a multi-track release pattern, not pure trunk-based development

---

## 4. Release & Versioning Findings

### 4.1 Release Mechanism
- **Tool**: semantic-release for versioning + GitHub Actions for publishing
- **Config File**: [.releaserc.json](../../../puya-ts/.releaserc.json)
- **Automation Level**: Semi-automated
  - Version generation is fully automated via semantic-release
  - npm publishing is automated via workflow
  - Production promotion (main→release) requires manual workflow_dispatch

### 4.2 Tag Format
- **Format**: Not explicitly defined in .releaserc.json (defaults to v1.2.3)
- **Source**: semantic-release default behavior

### 4.3 Version Sources
| File | Field | Current Value | Role |
|------|-------|---------------|------|
| [package.json](../../../puya-ts/package.json) | version | 1.0.0 | Source of truth for puya-ts |
| [packages/algo-ts/package.json](../../../puya-ts/packages/algo-ts/package.json) | version | 1.0.0 | Synced from puya-ts during release |
| [package.json](../../../puya-ts/package.json) | dependencies[@algorandfoundation/algorand-typescript] | file:packages/algo-ts/dist | Development dependency |

### 4.4 Version Propagation
- **Auto-commit**: Yes (By: semantic-release with @semantic-release/npm plugin at [.releaserc.json:60-64](../../../puya-ts/.releaserc.json#L60-L64))
- **Lockfile Updates**: Automatic (npm ci generates during install)
- **Custom Version Sync**: Script copies puya-ts version to algo-ts during release (Evidence: [release.yml:67-73](../../../puya-ts/.github/workflows/release.yml#L67-L73))

### 4.5 Monorepo Version Strategy
- **Synchronization**: All packages same version (both packages share the version from puya-ts)
- **Tool**: Custom script in release workflow (not using lerna or changesets)
- **Note**: algo-ts version is derived from puya-ts version during release, ensuring synchronization

---

## 5. Testing Strategy Findings

### 5.1 Test Framework
- **Framework**: vitest
- **Config File**: [vitest.config.mts](../../../puya-ts/vitest.config.mts) (root), [packages/algo-ts/vitest.config.mts](../../../puya-ts/packages/algo-ts/vitest.config.mts)

### 5.2 Coverage Configuration
- **Tool**: c8 (via @vitest/coverage-v8) (Evidence: [package.json:65](../../../puya-ts/package.json#L65))
- **Thresholds**: None defined in vitest.config.mts
- **Reporting**: Coverage collected via --coverage flag but no enforced thresholds (Evidence: [package.json:31-32](../../../puya-ts/package.json#L31-L32))
- **CI Collection**: Yes, coverage collected in CI (Evidence: [ci-all.yml:42](../../../puya-ts/.github/workflows/ci-all.yml#L42))

### 5.3 Test Structure
- **Separation**: Mixed (tests/ contains multiple categories)
  - [tests/approvals/](../../../puya-ts/tests/approvals/) - Approval tests
  - [tests/expected-output/](../../../puya-ts/tests/expected-output/) - Expected output tests
  - [tests/onchain/](../../../puya-ts/tests/onchain/) - On-chain tests
  - [tests/code-fix/](../../../puya-ts/tests/code-fix/) - Code fix tests
- **File Patterns**: *.spec.ts (Evidence: tests directory listing)
- **Special Categories**:
  - Approval tests for compiler output validation
  - On-chain tests requiring algokit localnet
  - Language server tests

### 5.4 CI Enforcement
- **Test Execution**: Yes (In workflow: [ci-all.yml:42](../../../puya-ts/.github/workflows/ci-all.yml#L42) via test:ci script)
- **Coverage Enforcement**: No (Coverage collected but no --cov-fail-under or threshold enforcement)
- **Matrix Testing**: Yes (Node.js 20.x, 22.x, 24.x) (Evidence: [ci-all.yml:14](../../../puya-ts/.github/workflows/ci-all.yml#L14))

### 5.5 Testing Gaps
- **No coverage thresholds**: Coverage is collected but not enforced, allowing quality degradation
- **No explicit test directory for algo-ts package**: [packages/algo-ts/package.json:21](../../../puya-ts/packages/algo-ts/package.json#L21) shows "test": "echo 'No tests'"
- **Complex test setup**: Requires Python, algokit, and localnet for full test execution (Evidence: [ci-all.yml:38-40](../../../puya-ts/.github/workflows/ci-all.yml#L38-L40))

---

## 6. Documentation Findings

### 6.1 Documentation Tooling
- **Tool**: TypeDoc
- **Config File**: [typedoc.json](../../../puya-ts/typedoc.json)

### 6.2 Generation Settings
- **Theme**: Default HTML theme
- **Extensions**: typedoc-plugin-missing-exports, typedoc-plugin-markdown (Evidence: [typedoc.json:18](../../../puya-ts/typedoc.json#L18))
- **Entry Points**: Multiple entry points from packages/algo-ts/src/ (Evidence: [typedoc.json:3-8](../../../puya-ts/typedoc.json#L3-L8))
- **Output**: docs/_html (Evidence: [typedoc.json:14](../../../puya-ts/typedoc.json#L14))
- **Build Command**: npm run script:documentation (Evidence: [package.json:41](../../../puya-ts/package.json#L41))

### 6.3 Publishing Automation
- **Hosting**: GitHub Pages
- **Workflow**: [gh-pages.yml](../../../puya-ts/.github/workflows/gh-pages.yml)
- **Triggers**:
  - workflow_call from release workflow (Evidence: [release.yml:97](../../../puya-ts/.github/workflows/release.yml#L97))
  - workflow_dispatch for manual builds
  - Only publishes when release branch is used (Evidence: [release.yml:96](../../../puya-ts/.github/workflows/release.yml#L96))

### 6.4 Documentation Structure
- **API Docs**: Yes (auto-generated from TypeScript via TypeDoc)
- **Guides/Tutorials**: Yes (extensive markdown guides)
  - [docs/language-guide.md](../../../puya-ts/docs/language-guide.md)
  - [docs/cli.md](../../../puya-ts/docs/cli.md)
  - [docs/migration-guides.md](../../../puya-ts/docs/migration-guides.md)
  - [docs/lg-*.md](../../../puya-ts/docs/) - Language guide sections
- **Examples**: Yes ([examples/](../../../puya-ts/examples/) directory)
- **Architecture Docs**: Yes ([docs/architecture-decisions/](../../../puya-ts/docs/architecture-decisions/))

### 6.5 Documentation Gaps
- **Documentation only published for production releases**: Docs only deploy when release branch is pushed (Evidence: [release.yml:96](../../../puya-ts/.github/workflows/release.yml#L96))
- **No preview documentation** for PRs or beta releases
- **No CHANGELOG.md**: Relies on GitHub releases generated by semantic-release

---

## 7. Gaps, Risks, and Observations

### 7.1 Critical Gaps
1. **No coverage thresholds enforced** (Evidence: [vitest.config.mts](../../../puya-ts/vitest.config.mts) lacks coverage configuration)
   - Coverage is collected but not enforced, allowing code quality to degrade over time
2. **No tests for algo-ts package** (Evidence: [packages/algo-ts/package.json:21](../../../puya-ts/packages/algo-ts/package.json#L21))
   - The algorand-typescript package has no tests despite being a published npm package
3. **No CHANGELOG.md file** in repository
   - Users cannot track version changes without checking GitHub releases

### 7.2 Risks
1. **SECURITY - HIGH PRIORITY: Supply chain risk from unpinned GitHub Actions**
   - 10 out of 11 actions pinned to tags instead of commit SHAs
   - Tags can be moved or deleted, compromising build reproducibility
   - Impact: Potential for malicious code injection via compromised actions
2. **Complex multi-branch release strategy**
   - Three release branches (alpha, main, release) increases complexity
   - Manual promotion workflow required for production releases
   - Risk of human error in promotion process (Evidence: [prod-release.yml](../../../puya-ts/.github/workflows/prod-release.yml))
3. **Monorepo version synchronization via custom script**
   - Version sync happens during release via custom script (Evidence: [release.yml:67-73](../../../puya-ts/.github/workflows/release.yml#L67-L73))
   - Not using standard monorepo tools (lerna, changesets)
   - Risk of sync failures or version mismatches
4. **No runtime version constraints**
   - No .nvmrc or package.json engines field
   - Developers may use inconsistent Node.js versions locally

### 7.3 Standardization Opportunities
1. **Reusable workflow pattern is exemplary**
   - [node-ci.yml](../../../puya-ts/.github/workflows/node-ci.yml) is a well-designed reusable workflow
   - Could be shared across AlgoKit TypeScript projects
   - Parameterized with sensible defaults
2. **Coverage threshold template**
   - Add vitest coverage configuration with thresholds (suggest: 80% lines, 75% branches)
   - Standardize across TypeScript repos
3. **Pin GitHub Actions to commit SHAs**
   - Create standardized list of approved actions with pinned SHAs
   - Use Dependabot to keep action versions up to date
4. **Consider simplifying to main + release only**
   - Current alpha/main/release pattern is complex
   - Could simplify to main (with beta prerelease) + release (stable) for most workflows

### 7.4 Unique Patterns (Non-Issues)
1. **Compiler test cases requiring algokit localnet**
   - Appropriate for a compiler that targets AVM
   - Validates on-chain behavior, not just compilation (Evidence: [ci-all.yml:38-40](../../../puya-ts/.github/workflows/ci-all.yml#L38-L40))
2. **Monorepo with synchronized versions**
   - Both packages shipped together as a cohesive unit
   - Makes sense for compiler (puya-ts) and standard library (algorand-typescript)
   - Version sync ensures compatibility
3. **Multiple TypeScript target versions in CI matrix**
   - Testing on Node.js 20.x, 22.x, 24.x ensures broad compatibility (Evidence: [ci-all.yml:14](../../../puya-ts/.github/workflows/ci-all.yml#L14))
   - Appropriate for a CLI tool that users will run in various environments
4. **Language server implementation**
   - Includes vscode-languageserver dependencies for IDE integration (Evidence: [package.json:100-102](../../../puya-ts/package.json#L100-L102))
   - Appropriate for a compiler with IDE support goals

---

## 8. Evidence Summary
- **Total Files Analyzed**: 17 files
- **Key Evidence Files**:
  - [package.json:3](../../../puya-ts/package.json#L3) (repository name and purpose)
  - [packages/algo-ts/package.json:2](../../../puya-ts/packages/algo-ts/package.json#L2) (monorepo structure)
  - [.releaserc.json:2-14](../../../puya-ts/.releaserc.json#L2-L14) (multi-branch release strategy)
  - [release.yml:67-91](../../../puya-ts/.github/workflows/release.yml#L67-L91) (custom version sync and publishing)
  - [node-ci.yml:1-197](../../../puya-ts/.github/workflows/node-ci.yml#L1-L197) (reusable workflow pattern)
  - [commitlint.config.cjs:1-13](../../../puya-ts/commitlint.config.cjs#L1-L13) (commit convention enforcement)
  - [vitest.config.mts:17-22](../../../puya-ts/vitest.config.mts#L17-L22) (test configuration)
  - [typedoc.json:1-28](../../../puya-ts/typedoc.json#L1-L28) (documentation configuration)
  - [ci-all.yml:38-40](../../../puya-ts/.github/workflows/ci-all.yml#L38-L40) (Python dependency for tests)
  - [prod-release.yml:30-44](../../../puya-ts/.github/workflows/prod-release.yml#L30-L44) (manual production promotion)
