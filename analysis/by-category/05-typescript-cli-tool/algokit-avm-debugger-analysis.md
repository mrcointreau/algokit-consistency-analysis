# Repository Analysis: algokit-avm-debugger

## 1. Repository Overview
- **Tech Stack**: TypeScript (with VSCode Extension component)
- **Purpose Category**: TypeScript CLI Tool + VSCode Extension (Hybrid - Debug Adapter Protocol implementation)
- **Monorepo**: Yes (2 packages: main debugger package + VSCode extension)
  - Main package: `@algorandfoundation/algokit-avm-debugger` (root)
  - Extension package: `avm-debug-vscode-extension` (extension/)
- **Signal Files**:
  - Configuration: [package.json](../../../algokit-avm-debugger/package.json), [extension/package.json](../../../algokit-avm-debugger/extension/package.json), [tsconfig.json](../../../algokit-avm-debugger/tsconfig.json)
  - CI/CD: [.github/workflows/ci.yaml](../../../algokit-avm-debugger/.github/workflows/ci.yaml), [.github/workflows/cd.yaml](../../../algokit-avm-debugger/.github/workflows/cd.yaml), [.github/workflows/prod_release.yaml](../../../algokit-avm-debugger/.github/workflows/prod_release.yaml)
  - Testing: [.nycrc](../../../algokit-avm-debugger/.nycrc), [.mocharc.js](../../../algokit-avm-debugger/.mocharc.js), tests/
  - Release: semantic-release config in [package.json](../../../algokit-avm-debugger/package.json#L102-L168), [CHANGELOG.md](../../../algokit-avm-debugger/CHANGELOG.md)
  - Code Quality: [.eslintrc.json](../../../algokit-avm-debugger/.eslintrc.json), [.prettierrc.json](../../../algokit-avm-debugger/.prettierrc.json)
  - Documentation: [README.md](../../../algokit-avm-debugger/README.md), [FEATURES.md](../../../algokit-avm-debugger/FEATURES.md)

---

## 2. CI/CD Findings

### 2.1 Workflow Inventory
| Workflow File | Purpose | Triggers |
|---------------|---------|----------|
| [ci.yaml](../../../algokit-avm-debugger/.github/workflows/ci.yaml) | PR validation & test execution | push (all branches except main), pull_request, workflow_call |
| [cd.yaml](../../../algokit-avm-debugger/.github/workflows/cd.yaml) | Continuous Deployment & Release | push to main/release branches, workflow_dispatch |
| [prod_release.yaml](../../../algokit-avm-debugger/.github/workflows/prod_release.yaml) | Production release promotion | workflow_dispatch (manual) |

### 2.2 Third-Party Actions
| Action | Version | Used In | Pinned |
|--------|---------|---------|--------|
| actions/checkout | v4 | ci.yaml, cd.yaml | **No** (tag-based) |
| actions/checkout | v3 | prod_release.yaml | **No** (tag-based) |
| actions/setup-node | v4 | ci.yaml, cd.yaml | **No** (tag-based) |
| devmasx/merge-branch | 854d3ac71ed1e9deb668e0074781b81fdd6e771f | prod_release.yaml | **Yes** (commit SHA) |

**SECURITY FINDINGS**:
- **HIGH PRIORITY**: 3 instances of unpinned actions using tag-based refs (actions/checkout@v4, actions/setup-node@v4, actions/checkout@v3)
- Tag-based references are mutable and pose supply chain security risks
- Only devmasx/merge-branch is properly pinned to commit SHA (Evidence: [.github/workflows/prod_release.yaml:18](../../../algokit-avm-debugger/.github/workflows/prod_release.yaml#L18), [.github/workflows/prod_release.yaml:25](../../../algokit-avm-debugger/.github/workflows/prod_release.yaml#L25))
- **INCONSISTENCY**: actions/checkout uses v3 in prod_release.yaml but v4 in other workflows

### 2.3 Runtime Versions
- **Node Version**: 20 (Source: Hardcoded in workflows)
  - CI matrix: Node 20 (Evidence: [.github/workflows/ci.yaml:15](../../../algokit-avm-debugger/.github/workflows/ci.yaml#L15))
  - CD workflow: Node 20.x (Evidence: [.github/workflows/cd.yaml:34](../../../algokit-avm-debugger/.github/workflows/cd.yaml#L34))
  - Package.json engine requirement: >=18.0.0 (Evidence: [package.json:10](../../../algokit-avm-debugger/package.json#L10))
- **Python Version**: N/A (TypeScript-only project)
- **No version files**: No .nvmrc or .node-version file present

### 2.4 Release Automation
- **Mechanism**: semantic-release (Evidence: [package.json:102-168](../../../algokit-avm-debugger/package.json#L102-L168))
- **Triggers**: Automated on push to main/release branches (Evidence: [.github/workflows/cd.yaml:4-8](../../../algokit-avm-debugger/.github/workflows/cd.yaml#L4-L8))
- **Automation Level**: Fully automated
  - Commits analysis with conventional commits preset
  - Automated changelog generation
  - Automated npm publishing to registry
  - Automated GitHub release creation
- **Plugins**: @semantic-release/commit-analyzer, @semantic-release/release-notes-generator, @semantic-release/npm, @semantic-release/github

### 2.5 CI/CD Gaps & Anomalies
1. **Security Risk**: Unpinned GitHub Actions pose supply chain attack vector
2. **Version Inconsistency**: actions/checkout@v3 vs @v4 across workflows
3. **No Coverage Enforcement**: Tests run in CI but no coverage thresholds enforced (Evidence: [.github/workflows/ci.yaml:26](../../../algokit-avm-debugger/.github/workflows/ci.yaml#L26) - no coverage command)
4. **Complex Release Strategy**: Requires manual workflow_dispatch for prod releases with branch merging logic (Evidence: [.github/workflows/prod_release.yaml](../../../algokit-avm-debugger/.github/workflows/prod_release.yaml))
5. **Missing Matrix Testing**: Only tests on Node 20, but package.json allows >=18.0.0
6. **No Pre-commit Hooks**: Despite having a pre-commit script defined (Evidence: [package.json:69](../../../algokit-avm-debugger/package.json#L69)), no .pre-commit-config.yaml or git hooks automation

---

## 3. Branching Strategy Findings

### 3.1 Branch Triggers
| Workflow | Branches | Tags | Purpose |
|----------|----------|------|---------|
| ci.yaml | All except main (branches-ignore: main) | N/A | PR validation and testing |
| cd.yaml | main, release | N/A | Automated releases via semantic-release |
| prod_release.yaml | N/A (manual dispatch) | N/A | Merge main→release→main for production promotion |

### 3.2 Commit Conventions
- **Commitlint**: No (No commitlint.config.* file found)
- **Pre-commit Hooks**: No (No .pre-commit-config.yaml found)
- **Conventional Commits**: Yes, enforced by semantic-release configuration (Evidence: [package.json:116](../../../algokit-avm-debugger/package.json#L116) - preset: conventionalcommits)
- **Manual Script Available**: `npm run pre-commit` defined but not automated (Evidence: [package.json:69](../../../algokit-avm-debugger/package.json#L69))

### 3.3 Release Branch Strategy
- **Semantic-Release Branches**: [main (prerelease: beta), release] (Evidence: [package.json:103-111](../../../algokit-avm-debugger/package.json#L103-L111))
- **Branch Configuration**:
  - `main` branch: Produces beta prerelease versions
  - `release` branch: Produces stable releases
- **Environment Branches**: None

### 3.4 Trunk-Based Compliance
- **Assessment**: Partially compliant
- **Evidence**:
  - Uses main branch with feature branches merged via PR
  - CI runs on all branches except main (Evidence: [.github/workflows/ci.yaml:4-5](../../../algokit-avm-debugger/.github/workflows/ci.yaml#L4-L5))
  - **Non-compliant element**: Separate long-lived `release` branch for production releases
  - Uses prerelease strategy (main→beta, release→stable) rather than pure trunk-based main-only releases
  - Manual promotion workflow required to merge main→release (Evidence: [.github/workflows/prod_release.yaml](../../../algokit-avm-debugger/.github/workflows/prod_release.yaml))

---

## 4. Release & Versioning Findings

### 4.1 Release Mechanism
- **Tool**: semantic-release
- **Config File**: Inline in [package.json](../../../algokit-avm-debugger/package.json#L102-L168) (no .releaserc.json)
- **Automation Level**: Fully automated (commit analysis, version bump, changelog, npm publish, GitHub release)

### 4.2 Tag Format
- **Format**: Not explicitly configured, defaults to semantic-release standard (v1.2.3)
- **Source**: semantic-release default behavior
- **Evidence**: CHANGELOG.md shows tags like v0.2.0, v0.1.3, etc. (Evidence: [CHANGELOG.md:43-47](../../../algokit-avm-debugger/CHANGELOG.md#L43-L47))

### 4.3 Version Sources
| File | Field | Current Value | Role |
|------|-------|---------------|------|
| [package.json](../../../algokit-avm-debugger/package.json#L3) | version | 0.0.0 | Placeholder - updated by semantic-release |
| [extension/package.json](../../../algokit-avm-debugger/extension/package.json#L4) | version | 0.1.0 | **INDEPENDENT** - VSCode extension version (not synced) |

**CRITICAL FINDING**: The extension package version (0.1.0) is not synchronized with the main package version (managed by semantic-release). This creates potential version drift between the npm package and VSCode extension.

### 4.4 Version Propagation
- **Auto-commit**: Yes (By: semantic-release)
- **Lockfile Updates**: Automatic (package-lock.json committed)
- **Version Source**: Single source of truth in package.json, updated by semantic-release

### 4.5 Monorepo Version Strategy
- **Synchronization**: **Mixed/Inconsistent**
  - Main package: Automated via semantic-release (starts at 0.0.0 placeholder)
  - Extension package: Independent manual versioning (0.1.0)
- **Tool**: No monorepo tooling (no pnpm workspaces, no lerna, no npm workspaces)
- **Gap**: No automation for extension package versioning or publishing

### 4.6 Versioning Gaps
1. **Version Desynchronization**: Extension package version not managed by semantic-release
2. **No Extension Publishing Automation**: VSCode extension publish is manual via `npm run extension:publish` (Evidence: [package.json:65-66](../../../algokit-avm-debugger/package.json#L65-L66))
3. **Missing Workspace Configuration**: Two packages but no workspace tooling for dependency management

---

## 5. Testing Strategy Findings

### 5.1 Test Framework
- **Framework**: Mocha + ts-mocha
- **Config File**: [.mocharc.js](../../../algokit-avm-debugger/.mocharc.js) (timeout: 30s)
- **Test Command**: `ts-mocha -p tsconfig.json 'tests/**/*test.ts'` (Evidence: [package.json:67](../../../algokit-avm-debugger/package.json#L67))

### 5.2 Coverage Configuration
- **Tool**: nyc (Istanbul for TypeScript)
- **Config**: [.nycrc](../../../algokit-avm-debugger/.nycrc)
- **Thresholds**: `"check-coverage": true` but **no specific percentage thresholds defined** (Evidence: [.nycrc:3](../../../algokit-avm-debugger/.nycrc#L3))
- **Reporting**: html, lcov, text, text-summary (Evidence: [.nycrc:6](../../../algokit-avm-debugger/.nycrc#L6))
- **Include Pattern**: `src/**/*.[tj]s?(x)` (Evidence: [.nycrc:5](../../../algokit-avm-debugger/.nycrc#L5))

### 5.3 Test Structure
- **Separation**: No separation (all tests in tests/ directory)
- **File Patterns**: `*.test.ts` (Evidence: tests/adapter.test.ts, tests/node/fileAccessor.test.ts)
- **Test Organization**:
  - Main adapter tests: [tests/adapter.test.ts](../../../algokit-avm-debugger/tests/adapter.test.ts)
  - Node-specific tests: [tests/node/](../../../algokit-avm-debugger/tests/node/)
  - Test utilities: [tests/client.ts](../../../algokit-avm-debugger/tests/client.ts), [tests/testing.ts](../../../algokit-avm-debugger/tests/testing.ts)

### 5.4 CI Enforcement
- **Test Execution**: Yes (In workflow: [ci.yaml](../../../algokit-avm-debugger/.github/workflows/ci.yaml#L26))
- **Coverage Enforcement**: **No**
  - CI runs `npm test` (not `npm run test:coverage`) (Evidence: [.github/workflows/ci.yaml:26](../../../algokit-avm-debugger/.github/workflows/ci.yaml#L26))
  - No coverage thresholds specified in .nycrc despite check-coverage: true
  - Coverage collection exists but is not enforced
- **Matrix Testing**: Yes (ubuntu-latest, windows-latest) (Evidence: [.github/workflows/ci.yaml:14](../../../algokit-avm-debugger/.github/workflows/ci.yaml#L14))

### 5.5 Testing Gaps
1. **No Coverage Enforcement in CI**: Tests run but coverage not checked/enforced
2. **No Coverage Thresholds**: .nycrc has check-coverage:true but no percentage thresholds
3. **Limited Node Version Testing**: Only tests Node 20, despite supporting >=18.0.0
4. **No Extension Testing**: No evidence of VSCode extension-specific tests

---

## 6. Documentation Findings

### 6.1 Documentation Tooling
- **Tool**: Manual markdown (No TypeDoc, no automated API docs)
- **Config File**: N/A
- **Documentation Files**:
  - [README.md](../../../algokit-avm-debugger/README.md): Usage, installation, programmatic API examples
  - [FEATURES.md](../../../algokit-avm-debugger/FEATURES.md): Feature list and capabilities
  - [CHANGELOG.md](../../../algokit-avm-debugger/CHANGELOG.md): Release history (Keep a Changelog format)

### 6.2 Generation Settings
- **Theme**: N/A (no TypeDoc)
- **Extensions**: N/A
- **Entry Points**: N/A
- **Build Commands**: None (manual markdown only)

### 6.3 Publishing Automation
- **Hosting**: None
- **Workflow**: None
- **Triggers**: N/A
- **Documentation Updates**: Manual only

### 6.4 Documentation Structure
- **API Docs**: No (No automated API documentation)
- **Guides/Tutorials**: Yes (README has usage examples with CLI and programmatic usage) (Evidence: [README.md:26-64](../../../algokit-avm-debugger/README.md#L26-L64))
- **Examples**: Yes (sampleWorkspace/ directory with example configurations)
- **Architecture Docs**: No

### 6.5 Documentation Gaps
1. **No Automated API Documentation**: TypeScript package with no TypeDoc or API docs generation
2. **No Documentation Publishing**: No hosted documentation site
3. **No Architecture Documentation**: Complex debugger implementation without architecture docs
4. **No Contributing Guide**: No CONTRIBUTING.md for contributors
5. **Manual Changelog**: Despite using semantic-release, CHANGELOG appears manually maintained (Evidence: Keep a Changelog format rather than semantic-release auto-generated)

---

## 7. Gaps, Risks, and Observations

### 7.1 Critical Gaps
1. **Unpinned GitHub Actions (Security P0)**: actions/checkout and actions/setup-node use mutable tag refs instead of commit SHAs (Evidence: [.github/workflows/ci.yaml:17-18](../../../algokit-avm-debugger/.github/workflows/ci.yaml#L17-L18))
2. **No Coverage Enforcement**: Tests exist but coverage not enforced in CI, no thresholds defined (Evidence: [.github/workflows/ci.yaml:26](../../../algokit-avm-debugger/.github/workflows/ci.yaml#L26), [.nycrc](../../../algokit-avm-debugger/.nycrc))
3. **Version Desynchronization**: Extension package version independent from main package, no automation (Evidence: [package.json:3](../../../algokit-avm-debugger/package.json#L3) vs [extension/package.json:4](../../../algokit-avm-debugger/extension/package.json#L4))
4. **No Commit Convention Automation**: Despite having pre-commit script, no hooks enforcement (Evidence: No .pre-commit-config.yaml)

### 7.2 Risks
1. **Supply Chain Security (HIGH)**: Unpinned actions can be compromised via tag manipulation
2. **Quality Drift (MEDIUM)**: No coverage enforcement allows test coverage to degrade over time
3. **Release Complexity (MEDIUM)**: Manual prod_release workflow with branch merging could lead to errors (Evidence: [.github/workflows/prod_release.yaml](../../../algokit-avm-debugger/.github/workflows/prod_release.yaml))
4. **Version Confusion (MEDIUM)**: Users may expect package version to match extension version
5. **Limited Testing (LOW)**: Only tests Node 20 despite supporting >=18

### 7.3 Standardization Opportunities
1. **Reusable Workflow**: PR validation workflow could be standardized across TypeScript AlgoKit repos
2. **Coverage Thresholds**: Implement standard 80% line/75% branch thresholds
3. **Action Pinning**: Adopt SHA-pinning for all GitHub Actions
4. **Monorepo Tooling**: Adopt pnpm workspaces or npm workspaces for proper monorepo management
5. **TypeDoc Integration**: Standard API documentation generation for TypeScript packages
6. **Pre-commit Hooks**: Standardize pre-commit hook automation across repos

### 7.4 Unique Patterns (Non-Issues)
1. **Dual-Package Structure**: Legitimate to have separate npm package and VSCode extension
2. **Debug Adapter Protocol**: Specialized use case requiring unique debugger implementation
3. **Trace-Based Debugging**: Non-traditional debugging model appropriate for blockchain execution replay
4. **Beta Prerelease on Main**: Intentional strategy for continuous beta releases before production promotion
5. **Manual Production Promotion**: Reasonable control gate for production releases via workflow_dispatch

---

## 8. Evidence Summary
- **Total Files Analyzed**: 23 key files
- **Key Evidence Files**:
  - [package.json:102-168](../../../algokit-avm-debugger/package.json#L102-L168) (semantic-release configuration)
  - [.github/workflows/ci.yaml:17-18](../../../algokit-avm-debugger/.github/workflows/ci.yaml#L17-L18) (unpinned actions)
  - [.github/workflows/prod_release.yaml:14-31](../../../algokit-avm-debugger/.github/workflows/prod_release.yaml#L14-L31) (manual release workflow)
  - [.nycrc:3](../../../algokit-avm-debugger/.nycrc#L3) (coverage config without thresholds)
  - [extension/package.json:4](../../../algokit-avm-debugger/extension/package.json#L4) (independent extension version)
  - [package.json:3](../../../algokit-avm-debugger/package.json#L3) (main package version placeholder)
  - [.github/workflows/cd.yaml:40](../../../algokit-avm-debugger/.github/workflows/cd.yaml#L40) (semantic-release execution)
  - [package.json:44-45](../../../algokit-avm-debugger/package.json#L44-L45) (CLI bin entry point)
  - [README.md](../../../algokit-avm-debugger/README.md) (documentation structure)
  - [CHANGELOG.md](../../../algokit-avm-debugger/CHANGELOG.md) (release history)

---

## 9. Category-Specific Assessment

**Expected Pattern for TypeScript CLI Tool**:
- ✅ Binary entry point (CLI command)
- ✅ Build/bundle configuration (esbuild)
- ✅ Cross-platform testing (ubuntu, windows)
- ✅ Automated releases
- ⚠️ Partial: Should have TypeDoc for library APIs
- ❌ Missing: Extension publishing automation
- ❌ Missing: Coverage enforcement

**Additional VSCode Extension Requirements**:
- ✅ Extension manifest (extension/package.json)
- ✅ Activation events configured
- ✅ Debug adapter contributions
- ⚠️ Partial: Extension build automation exists but not release automation
- ❌ Missing: Extension versioning automation

**Alignment Score**: 7/10 - Good automation for npm package, but gaps in coverage enforcement, documentation, and extension release management.
