# Repository Analysis: algokit-cli

## 1. Repository Overview
- **Tech Stack**: Python
- **Purpose Category**: Python CLI Tool
- **Monorepo**: No
- **Signal Files**:
  - Configuration: [pyproject.toml](../../../algokit-cli/pyproject.toml), [.pre-commit-config.yaml](../../../algokit-cli/.pre-commit-config.yaml)
  - CI/CD: [.github/workflows/pr.yaml](../../../algokit-cli/.github/workflows/pr.yaml), [.github/workflows/check-python.yaml](../../../algokit-cli/.github/workflows/check-python.yaml), [.github/workflows/build-python.yaml](../../../algokit-cli/.github/workflows/build-python.yaml), [.github/workflows/build-binaries.yaml](../../../algokit-cli/.github/workflows/build-binaries.yaml), [.github/workflows/cd.yaml](../../../algokit-cli/.github/workflows/cd.yaml), [.github/workflows/publish-release-packages.yaml](../../../algokit-cli/.github/workflows/publish-release-packages.yaml), [.github/workflows/clear-caches.yaml](../../../algokit-cli/.github/workflows/clear-caches.yaml)
  - Custom Actions: [.github/actions/setup-poetry/action.yaml](../../../algokit-cli/.github/actions/setup-poetry/action.yaml), [.github/actions/build-binaries/linux/action.yaml](../../../algokit-cli/.github/actions/build-binaries/linux/action.yaml), [.github/actions/build-binaries/macos/action.yaml](../../../algokit-cli/.github/actions/build-binaries/macos/action.yaml), [.github/actions/build-binaries/windows/action.yaml](../../../algokit-cli/.github/actions/build-binaries/windows/action.yaml), [.github/actions/install-apple-dev-id-cert/action.yaml](../../../algokit-cli/.github/actions/install-apple-dev-id-cert/action.yaml)
  - Release: [CHANGELOG.md](../../../algokit-cli/CHANGELOG.md)
  - Testing: [tests/](../../../algokit-cli/tests/)
  - Documentation: [docs/sphinx/conf.py](../../../algokit-cli/docs/sphinx/conf.py)

---

## 2. CI/CD Findings

### 2.1 Workflow Inventory
| Workflow File | Purpose | Triggers |
|---------------|---------|----------|
| [pr.yaml](../../../algokit-cli/.github/workflows/pr.yaml#L3-L9) | PR validation + scheduled checks | pull_request (paths-ignore: README.md), schedule (Mon 8AM UTC) |
| [check-python.yaml](../../../algokit-cli/.github/workflows/check-python.yaml#L3-L4) | Python code quality checks | workflow_call |
| [build-python.yaml](../../../algokit-cli/.github/workflows/build-python.yaml#L3) | Build & test Python wheel across matrix | workflow_call |
| [build-binaries.yaml](../../../algokit-cli/.github/workflows/build-binaries.yaml#L3-L14) | Build & test PyInstaller binaries | workflow_call (inputs: production_release, python_version, release_version) |
| [cd.yaml](../../../algokit-cli/.github/workflows/cd.yaml#L3-L23) | Continuous deployment to PyPI + binaries | push to main (paths-ignore), workflow_dispatch |
| [publish-release-packages.yaml](../../../algokit-cli/.github/workflows/publish-release-packages.yaml#L3-L53) | Publish to Homebrew, Winget, Snap | workflow_call, workflow_dispatch |
| [clear-caches.yaml](../../../algokit-cli/.github/workflows/clear-caches.yaml#L3-L7) | Clear repository caches | schedule (every 5 days), workflow_dispatch |

### 2.2 Third-Party Actions
| Action | Version | Used In | Pinned |
|--------|---------|---------|--------|
| actions/checkout | v4 | All workflows | No (tag-based) |
| actions/setup-python | v5 | check-python.yaml, build-python.yaml, build-binaries.yaml, cd.yaml | No (tag-based) |
| actions/setup-node | v4 | [build-python.yaml:22](../../../algokit-cli/.github/workflows/build-python.yaml#L22) | No (tag-based) |
| actions/cache | v4 | [setup-poetry/action.yaml:29](../../../algokit-cli/.github/actions/setup-poetry/action.yaml#L29) | No (tag-based) |
| actions/upload-artifact | v4 | build-python.yaml, build-binaries.yaml, cd.yaml, publish-release-packages.yaml | No (tag-based) |
| actions/create-github-app-token | v1 | [cd.yaml:49](../../../algokit-cli/.github/workflows/cd.yaml#L49), [publish-release-packages.yaml:60](../../../algokit-cli/.github/workflows/publish-release-packages.yaml#L60) | No (tag-based) |
| softprops/action-gh-release | v1 | [build-binaries.yaml:139](../../../algokit-cli/.github/workflows/build-binaries.yaml#L139) | No (tag-based) |
| MishaKav/pytest-coverage-comment | main | [build-python.yaml:70](../../../algokit-cli/.github/workflows/build-python.yaml#L70) | No (branch-based) |
| azure/trusted-signing-action | v0.3.20 | [build-binaries/windows/action.yaml:94,118](../../../algokit-cli/.github/actions/build-binaries/windows/action.yaml#L94) | No (tag-based) |
| lando/notarize-action | v2 | [build-binaries/macos/action.yaml:58](../../../algokit-cli/.github/actions/build-binaries/macos/action.yaml#L58) | No (tag-based) |
| snapcore/action-build | v1 | [publish-release-packages.yaml:132](../../../algokit-cli/.github/workflows/publish-release-packages.yaml#L132) | No (tag-based) |
| snapcore/action-publish | v1 | [publish-release-packages.yaml:142](../../../algokit-cli/.github/workflows/publish-release-packages.yaml#L142) | No (tag-based) |

**SECURITY FINDINGS**:
- **CRITICAL**: All 12 third-party actions are pinned to tags or branches, NOT commit SHAs
- This represents a **HIGH PRIORITY supply chain security risk** - tags and branches are mutable and can be compromised
- `MishaKav/pytest-coverage-comment@main` is especially risky (pinned to mutable branch)
- Recommended: Pin all actions to immutable commit SHAs (e.g., `actions/checkout@<commit-sha>`)

### 2.3 Runtime Versions
- **Python Version**:
  - Check workflow: 3.12 (Source: [check-python.yaml:16](../../../algokit-cli/.github/workflows/check-python.yaml#L16) - hardcoded)
  - Build matrix: 3.10, 3.11, 3.12, 3.13 (Source: [build-python.yaml:10](../../../algokit-cli/.github/workflows/build-python.yaml#L10) - hardcoded)
  - Binary builds: 3.12 (Source: [pr.yaml:31](../../../algokit-cli/.github/workflows/pr.yaml#L31), [cd.yaml:150](../../../algokit-cli/.github/workflows/cd.yaml#L150) - hardcoded)
  - Release job: 3.10 (Source: [cd.yaml:64](../../../algokit-cli/.github/workflows/cd.yaml#L64) - hardcoded)
  - pyproject.toml constraint: >=3.10,<3.14 (Source: [pyproject.toml:10](../../../algokit-cli/pyproject.toml#L10))
- **Node Version**: 20 (Source: [build-python.yaml:24](../../../algokit-cli/.github/workflows/build-python.yaml#L24) - hardcoded)
- **No version files**: No `.python-version` or `.nvmrc` files detected

### 2.4 Release Automation
- **Mechanism**: python-semantic-release (Evidence: [pyproject.toml:194-204](../../../algokit-cli/pyproject.toml#L194-L204), [cd.yaml:83-129](../../../algokit-cli/.github/workflows/cd.yaml#L83-L129))
- **Triggers**:
  - Automatic on push to main (non-production beta releases)
  - Manual workflow_dispatch for production releases (Evidence: [cd.yaml:18-23](../../../algokit-cli/.github/workflows/cd.yaml#L18-L23))
- **Multi-stage release process**:
  1. Feature branch releases: beta+branch-name prerelease (Evidence: [cd.yaml:80-96](../../../algokit-cli/.github/workflows/cd.yaml#L80-L96))
  2. Main branch beta releases: beta prerelease (Evidence: [cd.yaml:98-112](../../../algokit-cli/.github/workflows/cd.yaml#L98-L112))
  3. Production releases: stable version with PyPI upload (Evidence: [cd.yaml:114-129](../../../algokit-cli/.github/workflows/cd.yaml#L114-L129))

### 2.5 CI/CD Gaps & Anomalies
1. **Security Risk**: No commit SHA pinning for GitHub Actions (see section 2.2)
2. **Inconsistent Python versions**: Different Python versions used across workflows (3.10 for release, 3.12 for checks/binaries)
3. **Complex release logic**: Three different release paths with slightly different semantic-release flags (Evidence: [cd.yaml:80-129](../../../algokit-cli/.github/workflows/cd.yaml#L80-L129))
4. **No centralized version source**: Python versions hardcoded in multiple workflows instead of using a single source of truth
5. **Coverage comment continues on error**: `continue-on-error: true` for pytest-coverage-comment means PR comment failures are silently ignored (Evidence: [build-python.yaml:69](../../../algokit-cli/.github/workflows/build-python.yaml#L69))

---

## 3. Branching Strategy Findings

### 3.1 Branch Triggers
| Workflow | Branches | Tags | Purpose |
|----------|----------|------|---------|
| [pr.yaml](../../../algokit-cli/.github/workflows/pr.yaml#L4) | All PRs (paths-ignore: README.md) | None | PR validation |
| [cd.yaml](../../../algokit-cli/.github/workflows/cd.yaml#L4-L6) | main | None | Continuous deployment |
| [build-binaries.yaml](../../../algokit-cli/.github/workflows/build-binaries.yaml#L33-L35) | main (conditional signing) | None | Binary builds with conditional code signing |

### 3.2 Commit Conventions
- **Commitlint**: No (no commitlint.config.* files found)
- **Pre-commit Hooks**: Yes (Config: [.pre-commit-config.yaml](../../../algokit-cli/.pre-commit-config.yaml))
  - Hooks configured:
    - `ruff-format`: Python formatting (Evidence: [.pre-commit-config.yaml:4-12](../../../algokit-cli/.pre-commit-config.yaml#L4-L12))
    - `ruff`: Python linting with auto-fix (Evidence: [.pre-commit-config.yaml:13-22](../../../algokit-cli/.pre-commit-config.yaml#L13-L22))
    - `mypy`: Type checking (Evidence: [.pre-commit-config.yaml:23-31](../../../algokit-cli/.pre-commit-config.yaml#L23-L31))
  - Note: No commit message validation hooks

### 3.3 Release Branch Strategy
- **Semantic-Release Branches**: [main] only for production, supports feature branches for beta releases (Evidence: [pyproject.toml:202](../../../algokit-cli/pyproject.toml#L202), [cd.yaml:80-96](../../../algokit-cli/.github/workflows/cd.yaml#L80-L96))
- **Environment Branches**: None detected
- **Special handling**: Feature branches can trigger beta+branch-name prereleases (Evidence: [cd.yaml:87](../../../algokit-cli/.github/workflows/cd.yaml#L87))

### 3.4 Trunk-Based Compliance
- **Assessment**: Partially compliant
- **Evidence**:
  - Main branch used for production releases (Evidence: [pyproject.toml:202](../../../algokit-cli/pyproject.toml#L202))
  - Supports feature branch prereleases for testing (Evidence: [cd.yaml:80-96](../../../algokit-cli/.github/workflows/cd.yaml#L80-L96))
  - No long-lived release/* or develop branches detected
  - Beta prerelease capability suggests some branches may be longer-lived for testing

---

## 4. Release & Versioning Findings

### 4.1 Release Mechanism
- **Tool**: python-semantic-release v7.32.2 (Evidence: [pyproject.toml:44](../../../algokit-cli/pyproject.toml#L44))
- **Config File**: [pyproject.toml:194-204](../../../algokit-cli/pyproject.toml#L194-L204) [tool.semantic_release]
- **Automation Level**: Fully automated with manual production trigger
  - Automatic beta releases on main push
  - Manual workflow_dispatch required for production releases (Evidence: [cd.yaml:18-23](../../../algokit-cli/.github/workflows/cd.yaml#L18-L23))

### 4.2 Tag Format
- **Format**: v{version} (e.g., v1.2.3)
- **Source**: Derived from semantic-release configuration
- **Evidence**:
  - Tag creation enabled (Evidence: [pyproject.toml:201](../../../algokit-cli/pyproject.toml#L201) `tag_commit = true`)
  - Tag format shown in release workflows (Evidence: [cd.yaml:90](../../../algokit-cli/.github/workflows/cd.yaml#L90), [build-binaries.yaml:144](../../../algokit-cli/.github/workflows/build-binaries.yaml#L144))

### 4.3 Version Sources
| File | Field | Current Value | Role |
|------|-------|---------------|------|
| [pyproject.toml:3](../../../algokit-cli/pyproject.toml#L3) | tool.poetry.version | 2.10.0 | Source of truth (semantic-release updates this) |
| [pyproject.toml:195](../../../algokit-cli/pyproject.toml#L195) | tool.semantic_release.version_toml | pyproject.toml:tool.poetry.version | Points to version source |
| [pyproject.toml:198](../../../algokit-cli/pyproject.toml#L198) | tool.semantic_release.version_source | tag | Version determined from git tags |

### 4.4 Version Propagation
- **Auto-commit**: Yes (By: python-semantic-release)
- **Evidence**:
  - Commit message template defined (Evidence: [pyproject.toml:203](../../../algokit-cli/pyproject.toml#L203) `commit_message = "{version}\n\nskip-checks: true"`)
  - Bot token used for commits (Evidence: [cd.yaml:48-53](../../../algokit-cli/.github/workflows/cd.yaml#L48-L53), [cd.yaml:78](../../../algokit-cli/.github/workflows/cd.yaml#L78))
- **Lockfile Updates**: Automatic via Poetry (poetry.lock committed to repo)

### 4.5 Monorepo Version Strategy (if applicable)
- **N/A**: Not a monorepo

---

## 5. Testing Strategy Findings

### 5.1 Test Framework
- **Framework**: pytest
- **Config File**: [pyproject.toml:167-175](../../../algokit-cli/pyproject.toml#L167-L175) [tool.pytest.ini_options]
- **Additional plugins**:
  - pytest-cov (coverage)
  - pytest-mock (mocking)
  - pytest-xdist (parallel execution)
  - pytest-httpx (HTTP mocking)
  - pytest-sugar (better output)
  - approvaltests (approval testing)

### 5.2 Coverage Configuration
- **Tool**: pytest-cov (coverage.py)
- **Thresholds**: None enforced via --cov-fail-under
- **Reporting**:
  - Terminal output with missing lines (Evidence: [build-python.yaml:57](../../../algokit-cli/.github/workflows/build-python.yaml#L57) `--cov-report=term-missing:skip-covered`)
  - JUnit XML for CI (Evidence: [build-python.yaml:57](../../../algokit-cli/.github/workflows/build-python.yaml#L57) `--junitxml=pytest-junit.xml`)
  - PR comments via MishaKav/pytest-coverage-comment (Evidence: [build-python.yaml:67-73](../../../algokit-cli/.github/workflows/build-python.yaml#L67-L73))
- **Coverage scope**: `--cov=src` (Evidence: [build-python.yaml:57](../../../algokit-cli/.github/workflows/build-python.yaml#L57))

### 5.3 Test Structure
- **Separation**: Organized by CLI command/feature (Evidence: tests/ directory structure)
  - Feature-based directories: compile/, completions/, config/, dispenser/, doctor/, explore/, generate/, goal/, init/, localnet/, project/, tasks/
  - Special test categories: portability/ (binary tests marked with `pyinstaller_binary_tests` marker)
- **File Patterns**: test_*.py (Evidence: tests/ directory listing)
- **Parallel execution**: Yes, using pytest-xdist with `-n auto` (Evidence: [build-python.yaml:45,57](../../../algokit-cli/.github/workflows/build-python.yaml#L45))

### 5.4 CI Enforcement
- **Test Execution**: Yes (In workflow: [build-python.yaml](../../../algokit-cli/.github/workflows/build-python.yaml))
  - Matrix testing across Python 3.10, 3.11, 3.12, 3.13 and ubuntu/macos/windows (Evidence: [build-python.yaml:7-11](../../../algokit-cli/.github/workflows/build-python.yaml#L7-L11))
  - Special portability tests for PyInstaller binaries (Evidence: [build-binaries.yaml:115-127](../../../algokit-cli/.github/workflows/build-binaries.yaml#L115-L127))
- **Coverage Enforcement**: No
  - Coverage is collected and reported but no `--cov-fail-under` threshold enforcement detected
  - PR comments are informational only with `continue-on-error: true` (Evidence: [build-python.yaml:69](../../../algokit-cli/.github/workflows/build-python.yaml#L69))

### 5.5 Testing Gaps
1. **No coverage thresholds**: Coverage collected but not enforced, allowing coverage to drift downward
2. **PR comment failures ignored**: `continue-on-error: true` means coverage comment failures don't block PRs
3. **Mixed test execution**: Regular tests use `-n auto` but coverage run also uses `-n auto` which can cause issues with coverage collection (Evidence: [build-python.yaml:45,57](../../../algokit-cli/.github/workflows/build-python.yaml#L45))

---

## 6. Documentation Findings

### 6.1 Documentation Tooling
- **Tool**: Sphinx with sphinx-click extension
- **Config File**: [docs/sphinx/conf.py](../../../algokit-cli/docs/sphinx/conf.py)
- **Extensions**: sphinx_click (for documenting Click CLI commands) (Evidence: [docs/sphinx/conf.py:16](../../../algokit-cli/docs/sphinx/conf.py#L16))

### 6.2 Generation Settings
- **Theme**: Not explicitly configured (uses Sphinx default)
- **Extensions** (Sphinx): sphinx_click (Evidence: [docs/sphinx/conf.py:16](../../../algokit-cli/docs/sphinx/conf.py#L16))
- **Build commands**:
  - Defined in Poetry poe tasks (Evidence: [pyproject.toml:63-67](../../../algokit-cli/pyproject.toml#L63-L67))
  - `poe docs_generate`: sphinx-build with markdown output (Evidence: [pyproject.toml:64](../../../algokit-cli/pyproject.toml#L64))
  - `poe docs_toc`: Generate table of contents with gfm-toc (Evidence: [pyproject.toml:65](../../../algokit-cli/pyproject.toml#L65))
  - `poe docs_title`: Add title header (Evidence: [pyproject.toml:66](../../../algokit-cli/pyproject.toml#L66))
  - `poe docs`: Runs all three in sequence (Evidence: [pyproject.toml:67](../../../algokit-cli/pyproject.toml#L67))
- **Output format**: Markdown (using sphinxnotes-markdown-builder) (Evidence: [pyproject.toml:49](../../../algokit-cli/pyproject.toml#L49), [pyproject.toml:64](../../../algokit-cli/pyproject.toml#L64))

### 6.3 Publishing Automation
- **Hosting**: Not published automatically (docs likely consumed via GitHub repo)
- **Workflow**: Docs verification in CI (Evidence: [check-python.yaml:46-47](../../../algokit-cli/.github/workflows/check-python.yaml#L46-L47))
  - CI checks that docs are up to date by running `poe docs` and verifying no git changes
  - Ensures docs are regenerated before merging
- **Triggers**: Pre-merge validation only (no automatic publishing detected)

### 6.4 Documentation Structure
- **API Docs**: Yes - CLI command reference auto-generated from Click decorators via sphinx-click
- **Guides/Tutorials**: Yes - markdown docs in docs/features/ (Evidence: docs/features/*.md files)
- **Examples**: Not explicitly separated (integrated into feature docs)
- **Architecture Docs**: Yes - docs/architecture-decisions/ with multiple ADRs (Evidence: docs/architecture-decisions/*.md files)

### 6.5 Documentation Gaps
1. **No automatic publishing**: Docs must be manually viewed in the repository, not hosted on ReadTheDocs or GitHub Pages
2. **Local-only consumption**: Documentation generation validated in CI but not published to a public documentation site
3. **No versioned docs**: No evidence of per-version documentation hosting

---

## 7. Gaps, Risks, and Observations

### 7.1 Critical Gaps
1. **No coverage thresholds enforced** (Evidence: [build-python.yaml:57](../../../algokit-cli/.github/workflows/build-python.yaml#L57) - missing `--cov-fail-under`)
   - Impact: Code quality can degrade over time without enforcement
   - Recommendation: Add `--cov-fail-under=80` or similar threshold

2. **No commit message validation**
   - Evidence: No commitlint config found, no pre-commit hook for commit messages
   - Impact: Inconsistent commit messages affect changelog quality generated by semantic-release
   - Recommendation: Add commitlint with conventional commits config

3. **No automatic documentation publishing**
   - Evidence: Docs validated in CI but not published anywhere (Evidence: [check-python.yaml:46-47](../../../algokit-cli/.github/workflows/check-python.yaml#L46-L47))
   - Impact: Documentation not easily accessible to users
   - Recommendation: Publish to GitHub Pages or ReadTheDocs

### 7.2 Risks
1. **HIGH PRIORITY - Supply chain security risk**
   - All GitHub Actions pinned to mutable tags/branches instead of commit SHAs
   - Especially critical: `MishaKav/pytest-coverage-comment@main` on mutable branch
   - Impact: Compromised actions could inject malicious code into CI/CD pipeline
   - Recommendation: Pin all actions to commit SHAs with Dependabot for updates

2. **MEDIUM - Complex release process**
   - Three different release code paths with different semantic-release flags (Evidence: [cd.yaml:80-129](../../../algokit-cli/.github/workflows/cd.yaml#L80-L129))
   - Impact: Hard to understand, test, and maintain; potential for misconfiguration
   - Recommendation: Simplify or better document the three-tier release strategy

3. **MEDIUM - Inconsistent Python version usage**
   - Different versions used across workflows: 3.10 (release), 3.12 (checks/binaries)
   - Impact: Potential for version-specific issues in release process
   - Recommendation: Standardize on single Python version for all non-test workflows

4. **LOW - No centralized runtime version source**
   - Python/Node versions hardcoded in multiple workflow files
   - Impact: Harder to update runtime versions consistently
   - Recommendation: Use `.python-version` or matrix variable for single source of truth

### 7.3 Standardization Opportunities
1. **Reusable workflow pattern**
   - Already well-implemented with workflow_call pattern (Evidence: check-python.yaml, build-python.yaml, build-binaries.yaml)
   - Could be extracted to shared repo for use across AlgoKit projects
   - Template: Python CLI build-test-release workflow

2. **Pre-commit hooks configuration**
   - Good use of ruff, mypy in pre-commit (Evidence: [.pre-commit-config.yaml](../../../algokit-cli/.pre-commit-config.yaml))
   - Could be standardized template for Python projects
   - Missing: commit message validation (could add commitlint)

3. **PyInstaller binary build pattern**
   - Sophisticated multi-platform binary build with code signing (Evidence: [build-binaries.yaml](../../../algokit-cli/.github/workflows/build-binaries.yaml), custom actions)
   - Could be extracted to reusable action for other Python CLI tools
   - Handles: Linux, Windows, macOS (Intel + ARM), code signing, notarization

4. **Sphinx + markdown generation pattern**
   - Interesting approach using Sphinx to generate markdown docs (Evidence: [pyproject.toml:64](../../../algokit-cli/pyproject.toml#L64))
   - Could be template for CLI tools that want markdown docs with Sphinx features

### 7.4 Unique Patterns (Non-Issues)
1. **Multi-tier release strategy** (Feature branch beta, main beta, main production)
   - Legitimate for CLI tool needing extensive pre-release testing (Evidence: [cd.yaml:80-129](../../../algokit-cli/.github/workflows/cd.yaml#L80-L129))
   - Complexity justified by need for safe binary distribution

2. **PyInstaller binary portability tests**
   - Dedicated test marker `pyinstaller_binary_tests` (Evidence: [pyproject.toml:171](../../../algokit-cli/pyproject.toml#L171), [build-binaries.yaml:115-127](../../../algokit-cli/.github/workflows/build-binaries.yaml#L115-L127))
   - Appropriate for CLI tool distributed as binaries
   - Tests excluded by default, run only in binary build workflow

3. **Conditional code signing**
   - Code signing only on main branch non-PR events (Evidence: [build-binaries.yaml:27-40](../../../algokit-cli/.github/workflows/build-binaries.yaml#L27-L40))
   - Legitimate security practice to avoid signing PR binaries

4. **Multi-package manager distribution**
   - Publishes to PyPI, Homebrew, Winget, Snap (Evidence: [publish-release-packages.yaml](../../../algokit-cli/.github/workflows/publish-release-packages.yaml))
   - Appropriate for CLI tool maximizing installation convenience

5. **Vendor directory exclusion**
   - Excludes `src/algokit/core/_vendor/` from linting/type checking (Evidence: [pyproject.toml:153](../../../algokit-cli/pyproject.toml#L153), [.pre-commit-config.yaml:12,22,31](../../../algokit-cli/.pre-commit-config.yaml#L12))
   - Appropriate for vendored dependencies (auth0 JWT verification code)

---

## 8. Evidence Summary
- **Total Files Analyzed**: 23
- **Key Evidence Files**:
  - [pyproject.toml:1-204](../../../algokit-cli/pyproject.toml) (for project config, dependencies, semantic-release, testing, tooling)
  - [.github/workflows/pr.yaml:1-33](../../../algokit-cli/.github/workflows/pr.yaml) (for PR validation triggers)
  - [.github/workflows/check-python.yaml:1-48](../../../algokit-cli/.github/workflows/check-python.yaml) (for code quality checks)
  - [.github/workflows/build-python.yaml:1-77](../../../algokit-cli/.github/workflows/build-python.yaml) (for test matrix and coverage)
  - [.github/workflows/build-binaries.yaml:1-146](../../../algokit-cli/.github/workflows/build-binaries.yaml) (for binary builds and code signing)
  - [.github/workflows/cd.yaml:1-165](../../../algokit-cli/.github/workflows/cd.yaml) (for release automation and semantic-release config)
  - [.github/workflows/publish-release-packages.yaml:1-148](../../../algokit-cli/.github/workflows/publish-release-packages.yaml) (for package distribution)
  - [.github/workflows/clear-caches.yaml:1-31](../../../algokit-cli/.github/workflows/clear-caches.yaml) (for cache management)
  - [.github/actions/setup-poetry/action.yaml:1-33](../../../algokit-cli/.github/actions/setup-poetry/action.yaml) (for Poetry setup and caching)
  - [.pre-commit-config.yaml:1-32](../../../algokit-cli/.pre-commit-config.yaml) (for pre-commit hooks)
  - [docs/sphinx/conf.py:1-20](../../../algokit-cli/docs/sphinx/conf.py) (for documentation tooling)
  - tests/ directory structure (for test organization)
