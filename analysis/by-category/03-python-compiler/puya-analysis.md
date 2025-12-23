# Repository Analysis: puya

## 1. Repository Overview
- **Tech Stack**: Python
- **Purpose Category**: Python Compiler/Language Tool (Algorand Python optimizing compiler with LSP support)
- **Monorepo**: Yes (2 packages: puyapy compiler + algorand-python stubs)
- **Signal Files**:
  - CI/CD: [.github/workflows/check-python.yaml](../../../puya/.github/workflows/check-python.yaml), [.github/workflows/cd.yaml](../../../puya/.github/workflows/cd.yaml), [.github/workflows/build-binaries.yaml](../../../puya/.github/workflows/build-binaries.yaml), [.github/workflows/gh-pages.yaml](../../../puya/.github/workflows/gh-pages.yaml), [.github/workflows/prerelease.yaml](../../../puya/.github/workflows/prerelease.yaml)
  - Release: [CHANGELOG.md](../../../puya/CHANGELOG.md), [pyproject.toml](../../../puya/pyproject.toml) (tool.semantic_release section)
  - Versioning: [pyproject.toml:3](../../../puya/pyproject.toml#L3) (version = "5.5.0"), [stubs/pyproject.toml](../../../puya/stubs/pyproject.toml)
  - Testing: [tests/](../../../puya/tests/), [test_cases/](../../../puya/test_cases/), [.coveragerc](../../../puya/.coveragerc), [pyproject.toml:108](../../../puya/pyproject.toml#L108) (pytest config)
  - Documentation: [docs/](../../../puya/docs/), [docs/conf.py](../../../puya/docs/conf.py) (Sphinx)
  - Branching: [.pre-commit-config.yaml](../../../puya/.pre-commit-config.yaml) (ruff, mypy hooks)
  - Build: [pyproject.toml:104](../../../puya/pyproject.toml#L104) (hatchling), [uv.lock](../../../puya/uv.lock)

---

## 2. CI/CD Findings

### 2.1 Workflow Inventory
| Workflow File | Purpose | Triggers |
|---------------|---------|----------|
| [check-python.yaml](../../../puya/.github/workflows/check-python.yaml) | PR validation (pre-commit, tests, coverage, compile-all) | pull_request |
| [cd.yaml](../../../puya/.github/workflows/cd.yaml) | Release automation (wheels, binaries, PyPI, docs) | workflow_dispatch |
| [build-binaries.yaml](../../../puya/.github/workflows/build-binaries.yaml) | Build/test PyInstaller binaries (Linux/macOS/Windows) | workflow_call |
| [gh-pages.yaml](../../../puya/.github/workflows/gh-pages.yaml) | Sphinx docs build and GitHub Pages publish | workflow_call, workflow_dispatch |
| [prerelease.yaml](../../../puya/.github/workflows/prerelease.yaml) | Prerelease automation (binaries only) | workflow_dispatch |

### 2.2 Third-Party Actions
| Action | Version | Used In | Pinned |
|--------|---------|---------|--------|
| actions/checkout | v4 | All workflows | **No** (tag-based) |
| actions/create-github-app-token | v1 | check-python.yaml | **No** (tag-based) |
| actions/upload-artifact | v4 | All workflows | **No** (tag-based) |
| actions/download-artifact | v4 | All workflows | **No** (tag-based) |
| actions/upload-pages-artifact | v3 | gh-pages.yaml | **No** (tag-based) |
| actions/deploy-pages | v4 | gh-pages.yaml | **No** (tag-based) |
| astral-sh/setup-uv | v5 | check-python.yaml:186 | **No** (tag-based) |
| astral-sh/setup-uv | v6 | setup-python-venv action | **No** (tag-based) |
| thollander/actions-comment-pull-request | v3 | check-python.yaml | **No** (tag-based) |
| MishaKav/pytest-coverage-comment | main | check-python.yaml:219 | **No** (branch-based) |
| pypa/gh-action-pypi-publish | release/v1 | cd.yaml | **No** (branch-based) |
| azure/trusted-signing-action | v0.5.1 | build-binaries/windows action | **No** (tag-based) |
| lando/notarize-action | v2 | build-binaries/macos action | **No** (tag-based) |

**SECURITY FINDINGS**:
- **HIGH PRIORITY**: All GitHub Actions are pinned to tags (v1, v4, etc.) or branches (main, release/v1) instead of immutable commit SHAs
- **CRITICAL**: `MishaKav/pytest-coverage-comment@main` and `pypa/gh-action-pypi-publish@release/v1` use branch refs, which are mutable and pose supply chain security risks
- Supply chain attack surface: 13 different third-party actions across 17 usage points, all unpinned

### 2.3 Runtime Versions
- **Python Version**: 3.13 (default), 3.12.11 (Windows shell test) (Source: [.github/actions/setup-python-venv/action.yaml:6](../../../puya/.github/actions/setup-python-venv/action.yaml#L6) hardcoded default, overridable via input)
- **Python Version (CI)**: Inherited from action defaults (Source: Most workflows use action default)
- **Python Constraint**: >=3.12.0,<4 (Source: [pyproject.toml:14](../../../puya/pyproject.toml#L14))
- **No .python-version file**: Runtime versions are hardcoded in workflows

### 2.4 Release Automation
- **Mechanism**: python-semantic-release (Evidence: [pyproject.toml:308](../../../puya/pyproject.toml#L308))
- **Triggers**: Manual workflow_dispatch on [cd.yaml](../../../puya/.github/workflows/cd.yaml) and [prerelease.yaml](../../../puya/.github/workflows/prerelease.yaml)
- **Changelog**: Automated via scriv fragments (Evidence: [changelog.d/](../../../puya/changelog.d/), [pyproject.toml:360](../../../puya/pyproject.toml#L360))
- **Binary Builds**: Cross-platform PyInstaller binaries (Linux x64/arm64, macOS x64/arm64, Windows x64) with code signing
- **Distribution**: PyPI (puyapy + algorand-python wheels), GitHub releases (binaries + wheels)

### 2.5 CI/CD Gaps & Anomalies
1. **No Python version file**: Runtime versions hardcoded in workflows instead of using `.python-version` or reading from `pyproject.toml`
2. **Inconsistent Python versions**: Default is 3.13, but Windows shell test uses 3.12.11 (Evidence: [check-python.yaml:291](../../../puya/.github/workflows/check-python.yaml#L291))
3. **Matrix testing limited**: Tests run on ubuntu-latest and windows-latest only, no Python version matrix (3.12/3.13)
4. **Complex release workflow**: Manual workflow_dispatch with 7 boolean inputs, requires careful coordination
5. **Dual changelog system**: Uses both scriv fragments and semantic-release (Evidence: [cd.yaml:92](../../../puya/.github/workflows/cd.yaml#L92) runs `scriv collect`, then semantic-release)
6. **Binary signing conditional**: Code signing only enabled when `allow_signing: true` and on main branch (Evidence: [cd.yaml:141](../../../puya/.github/workflows/cd.yaml#L141))

---

## 3. Branching Strategy Findings

### 3.1 Branch Triggers
| Workflow | Branches | Tags | Purpose |
|----------|----------|------|---------|
| check-python.yaml | all PRs | none | PR validation (tests, coverage, pre-commit, compile-all) |
| cd.yaml | main (workflow_dispatch) | none | Full release (wheels, binaries, PyPI, docs) |
| prerelease.yaml | main (workflow_dispatch) | none | Prerelease binaries only |
| gh-pages.yaml | none (workflow_call) | none | Docs publishing (called by cd.yaml) |

### 3.2 Commit Conventions
- **Commitlint**: No (no commitlint.config.* found)
- **Pre-commit Hooks**: Yes (Evidence: [.pre-commit-config.yaml](../../../puya/.pre-commit-config.yaml))
  - Hooks: ruff-format, ruff (with --fix), mypy
  - **Note**: No commit message validation hook
- **Semantic-release commit parser**: Configured (Evidence: [pyproject.toml:323](../../../puya/pyproject.toml#L323))
  - Allowed tags: build, chore, ci, docs, feat, fix, perf, style, refactor, test
  - Minor tags: feat
  - Patch tags: fix, perf, docs

### 3.3 Release Branch Strategy
- **Semantic-Release Branches**: [main, alpha] (Evidence: [pyproject.toml:313](../../../puya/pyproject.toml#L313))
  - main: prerelease_token=rc, prerelease=false (stable releases)
  - alpha: match=".*", prerelease_token=rc, prerelease=true (any branch can trigger prerelease)
- **Environment Branches**: None (no preview/staging/production branches)
- **Tag Format**: v{version} (Evidence: [pyproject.toml:311](../../../puya/pyproject.toml#L311))

### 3.4 Trunk-Based Compliance
- **Assessment**: Partially compliant
- **Evidence**:
  - Main branch is primary release branch ([pyproject.toml:313](../../../puya/pyproject.toml#L313))
  - Alpha branch config allows prerelease from any branch ([pyproject.toml:318](../../../puya/pyproject.toml#L318))
  - No long-lived development branches (no git-flow pattern)
  - Releases are manual via workflow_dispatch, not automated on merge to main
  - **Deviation**: Allows prerelease from any branch (match=".*"), which diverges from strict trunk-based development

---

## 4. Release & Versioning Findings

### 4.1 Release Mechanism
- **Tool**: python-semantic-release v9.8.7 (Evidence: [pyproject.toml:59](../../../puya/pyproject.toml#L59))
- **Config File**: [pyproject.toml](../../../puya/pyproject.toml) [tool.semantic_release] section
- **Automation Level**: Semi-automated
  - Version bumping: Automated by semantic-release
  - Changelog: Automated via scriv fragments
  - Tagging: Automated by semantic-release
  - PyPI publishing: Automated via trusted publishing
  - GitHub releases: Automated by semantic-release publish command
  - **Trigger**: Manual workflow_dispatch (not automated on merge)

### 4.2 Tag Format
- **Format**: v1.2.3 (with 'v' prefix)
- **Source**: [pyproject.toml:311](../../../puya/pyproject.toml#L311) `tag_format = "v{version}"`
- **Current Version**: v5.5.0 (Evidence: [pyproject.toml:3](../../../puya/pyproject.toml#L3), [CHANGELOG.md:9](../../../puya/CHANGELOG.md#L9))

### 4.3 Version Sources
| File | Field | Current Value | Role |
|------|-------|---------------|------|
| [pyproject.toml:3](../../../puya/pyproject.toml#L3) | project.version | 5.5.0 | Source of truth (updated by semantic-release) |
| [stubs/pyproject.toml](../../../puya/stubs/pyproject.toml) | project.version | (separate package) | Independent version for algorand-python stubs |
| [pyproject.toml:309](../../../puya/pyproject.toml#L309) | tool.semantic_release.version_toml | ["pyproject.toml:project.version"] | Version location config |
| No __version__ export | N/A | N/A | Not used (CLI package, no programmatic version export) |

### 4.4 Version Propagation
- **Auto-commit**: Yes (By: semantic-release + manual uv lock update)
  - Evidence: [cd.yaml:104](../../../puya/cd.yaml#L104) runs `semantic-release version --no-commit`, then `uv lock --upgrade-package puyapy`, then `semantic-release version` with commit
  - **Unique pattern**: Manual uv lock update sandwiched between semantic-release steps
- **Lockfile Updates**: Manual via `uv lock --upgrade-package puyapy` (Evidence: [cd.yaml:106](../../../puya/cd.yaml#L106))
- **Commit Message**: "{version}\n\nAutomatically generated by python-semantic-release" (Evidence: [pyproject.toml:310](../../../puya/pyproject.toml#L310))

### 4.5 Monorepo Version Strategy
- **Synchronization**: Independent versions
- **Packages**:
  1. puyapy (compiler) - version 5.5.0 ([pyproject.toml:3](../../../puya/pyproject.toml#L3))
  2. algorand-python (stubs) - separate version ([stubs/pyproject.toml](../../../puya/stubs/pyproject.toml))
- **Tool**: uv workspaces (Evidence: [pyproject.toml:80](../../../puya/pyproject.toml#L80) uv.sources, editable stubs dependency)
- **Stubs Version Check**: Enforced in CD workflow (Evidence: [cd.yaml:72](../../../puya/cd.yaml#L72) runs `scripts/check_stubs_version.py`)
- **Version Bumping**: Script available (Evidence: [pyproject.toml:344](../../../puya/pyproject.toml#L344) `poe bump_stubs`)

---

## 5. Testing Strategy Findings

### 5.1 Test Framework
- **Framework**: pytest v8.x (Evidence: [pyproject.toml:43](../../../puya/pyproject.toml#L43))
- **Config File**: [pyproject.toml](../../../puya/pyproject.toml) [tool.pytest.ini_options] section (lines 108-131)
- **Extensions**: pytest-xdist (parallel execution), pytest-cov (coverage), pytest-split (CI splitting), pytest-asyncio

### 5.2 Coverage Configuration
- **Tool**: pytest-cov v4.1.0+ with coverage.py (Evidence: [pyproject.toml:47](../../../puya/pyproject.toml#L47), [.coveragerc](../../../puya/.coveragerc))
- **Config File**: [.coveragerc](../../../puya/.coveragerc)
- **Thresholds**: **None explicitly enforced** (no `--cov-fail-under` in pytest args or CI)
- **Source**: src/ (Evidence: [.coveragerc:2](../../../puya/.coveragerc#L2))
- **Omit**: `src/puyapy/_vendor/*`, `src/_puya_lib/*` (Evidence: [.coveragerc:3](../../../puya/.coveragerc#L3))
- **Reporting**: XML (for CI), terminal (Evidence: [check-python.yaml:129](../../../puya/.github/workflows/check-python.yaml#L129), [pyproject.toml:357](../../../puya/pyproject.toml#L357))
- **CI Reporting**: PR comment via MishaKav/pytest-coverage-comment (Evidence: [check-python.yaml:219](../../../puya/.github/workflows/check-python.yaml#L219))

### 5.3 Test Structure
- **Separation**: Mixed (unit and integration tests in tests/, compiler test cases in test_cases/)
- **File Patterns**: `test_*.py` (Evidence: tests/test_*.py files)
- **Special Categories**:
  - tests/ - Unit and integration tests
  - test_cases/ - Compiler test cases (example Algorand Python code)
  - Localnet marker: `@pytest.mark.localnet` for tests requiring algokit localnet (Evidence: [pyproject.toml:110](../../../puya/pyproject.toml#L110))
  - Slow marker: `@pytest.mark.slow` (Evidence: [pyproject.toml:111](../../../puya/pyproject.toml#L111))
- **Parallel Execution**: pytest-xdist with `--dist worksteal` (Evidence: [pyproject.toml:113](../../../puya/pyproject.toml#L113))

### 5.4 CI Enforcement
- **Test Execution**: Yes (In workflow: [check-python.yaml](../../../puya/.github/workflows/check-python.yaml))
  - Matrix: 2 groups × 2 modules (localnet/not localnet) = 4 jobs on ubuntu-latest (Evidence: [check-python.yaml:112](../../../puya/.github/workflows/check-python.yaml#L112))
  - Windows: 2 groups × 1 module (not localnet) = 2 jobs on windows-latest (Evidence: [check-python.yaml:156](../../../puya/.github/workflows/check-python.yaml#L156))
  - Test splitting: Via pytest-split `--splits 2 --group N` (Evidence: [check-python.yaml:129](../../../puya/.github/workflows/check-python.yaml#L129))
- **Coverage Enforcement**: **No** (no --cov-fail-under threshold enforced)
  - Coverage is collected and reported but not enforced (Evidence: [check-python.yaml:203](../../../puya/check-python.yaml#L203) combines coverage, no threshold check)
- **Coverage Reporting**: Yes (PR comments with coverage report, Evidence: [check-python.yaml:218](../../../puya/.github/workflows/check-python.yaml#L218))

### 5.5 Testing Gaps
1. **No coverage threshold enforcement**: Coverage collected but no minimum threshold enforced in CI
2. **No Python version matrix**: Tests run on single Python version (3.13 default), but package supports >=3.12
3. **Windows localnet tests skipped**: Docker container issues on Windows (Evidence: [check-python.yaml:154](../../../puya/.github/workflows/check-python.yaml#L154) comment)
4. **No E2E test separation**: E2E tests (localnet) and unit tests mixed, separated only by pytest markers

---

## 6. Documentation Findings

### 6.1 Documentation Tooling
- **Tool**: Sphinx v7.2.6+ (Evidence: [pyproject.toml:52](../../../puya/pyproject.toml#L52))
- **Config File**: [docs/conf.py](../../../puya/docs/conf.py)
- **Extensions**:
  - sphinx.ext.githubpages (Evidence: [docs/conf.py:18](../../../puya/docs/conf.py#L18))
  - sphinx.ext.intersphinx (Evidence: [docs/conf.py:19](../../../puya/docs/conf.py#L19))
  - sphinx-copybutton (Evidence: [docs/conf.py:20](../../../puya/docs/conf.py#L20))
  - myst-parser (Markdown support, Evidence: [docs/conf.py:21](../../../puya/docs/conf.py#L21))
  - autodoc2 (API doc generation, Evidence: [docs/conf.py:22](../../../puya/docs/conf.py#L22))

### 6.2 Generation Settings
- **Theme**: furo (Evidence: [docs/conf.py:48](../../../puya/docs/conf.py#L48), [pyproject.toml:53](../../../puya/pyproject.toml#L53))
- **Extensions** (Sphinx): githubpages, intersphinx, copybutton, myst-parser, autodoc2
- **Autodoc2 Config**:
  - Package: algopy stubs ([docs/conf.py:66](../../../puya/docs/conf.py#L66))
  - Docstring parser: myst (Markdown) (Evidence: [docs/conf.py:72](../../../puya/docs/conf.py#L72))
  - Custom renderer: docs.rendering.MystRenderer (Evidence: [docs/conf.py:83](../../../puya/docs/conf.py#L83))
- **Build Command**: `poe docs` (Evidence: [pyproject.toml:336](../../../puya/pyproject.toml#L336), runs `scripts.generate_docs:main()`)

### 6.3 Publishing Automation
- **Hosting**: GitHub Pages (Evidence: [gh-pages.yaml](../../../puya/.github/workflows/gh-pages.yaml))
- **Workflow**: [.github/workflows/gh-pages.yaml](../../../puya/.github/workflows/gh-pages.yaml)
- **Triggers**:
  - workflow_call (called by [cd.yaml:215](../../../puya/.github/workflows/cd.yaml#L215))
  - workflow_dispatch (manual)
- **Deployment**:
  - Sphinx build → [gh-pages.yaml:24](../../../puya/gh-pages.yaml#L24) `poe docs`
  - Upload to GitHub Pages → [gh-pages.yaml:27](../../../puya/gh-pages.yaml#L27) actions/upload-pages-artifact@v3
  - Deploy → [gh-pages.yaml:32](../../../puya/gh-pages.yaml#L32) actions/deploy-pages@v4
- **Automation**: Docs published automatically during CD release workflow (if `publish_docs: true`)

### 6.4 Documentation Structure
- **API Docs**: Yes (autodoc2 generates API docs from algopy stubs, Evidence: [docs/conf.py:64](../../../puya/docs/conf.py#L64))
- **Guides/Tutorials**: Yes (Evidence: docs/language-guide.md, docs/compiler.md, docs/front-end-guide/)
- **Examples**: Yes (Evidence: examples/ directory, linked from README.md)
- **Architecture Docs**: Yes (Evidence: ARCHITECTURE.md, docs/architecture/)

### 6.5 Documentation Gaps
1. **No version in Sphinx config**: docs/conf.py doesn't read version from pyproject.toml, may lead to stale version in docs
2. **Manual docs workflow_dispatch**: Can trigger docs publish independently of release, potential for docs/version mismatch
3. **No automated link checking**: No workflow to validate external links or internal references

---

## 7. Gaps, Risks, and Observations

### 7.1 Critical Gaps
1. **No coverage threshold enforcement** (Evidence: [pyproject.toml:113](../../../puya/pyproject.toml#L113) has pytest-cov but no --cov-fail-under, [check-python.yaml:129](../../../puya/.github/workflows/check-python.yaml#L129) runs pytest --cov but no threshold)
   - Impact: Code quality can degrade without minimum coverage requirements
2. **No Python version file** (Evidence: No .python-version, versions hardcoded in [setup-python-venv/action.yaml:6](../../../puya/.github/actions/setup-python-venv/action.yaml#L6))
   - Impact: Inconsistent Python versions across local dev and CI, harder to maintain
3. **No commitlint enforcement** (Evidence: No commitlint.config.*, [.pre-commit-config.yaml](../../../puya/.pre-commit-config.yaml) has no commit-msg hook)
   - Impact: Semantic-release depends on conventional commits, but no enforcement at commit time
4. **Incomplete matrix testing** (Evidence: [check-python.yaml:109](../../../puya/.github/workflows/check-python.yaml#L109) no Python version matrix)
   - Impact: Package supports Python 3.12-3.13 but tests only run on one version

### 7.2 Risks
1. **Supply chain security - unpinned actions** (HIGH PRIORITY)
   - All 13 third-party actions use tag/branch refs instead of commit SHAs
   - `MishaKav/pytest-coverage-comment@main` uses mutable branch ref
   - Impact: Vulnerable to supply chain attacks if action repos are compromised
2. **Complex release workflow** (Medium impact)
   - Manual workflow_dispatch with 7 boolean inputs ([cd.yaml:6](../../../puya/.github/workflows/cd.yaml#L6))
   - Risk of human error in selecting correct inputs
   - Impact: Failed releases, incorrect artifacts published
3. **Dual changelog system complexity** (Medium impact)
   - Uses both scriv (fragments) and semantic-release (changelog generation)
   - Evidence: [cd.yaml:92](../../../puya/.github/workflows/cd.yaml#L92) runs `scriv collect`, then semantic-release generates changelog
   - Risk of inconsistency or duplication
4. **No automated dependency updates** (Medium impact)
   - No dependabot or renovate configuration found
   - Impact: Stale dependencies, security vulnerabilities
5. **Inconsistent Python versions in CI** (Low impact)
   - Default 3.13, but [check-python.yaml:291](../../../puya/.github/workflows/check-python.yaml#L291) uses 3.12.11 for Windows shell test
   - Impact: Potential platform-specific bugs not caught

### 7.3 Standardization Opportunities
1. **Reusable workflow candidates**:
   - Python setup action (already local action: [.github/actions/setup-python-venv](../../../puya/.github/actions/setup-python-venv))
   - Binary build workflows (already reusable: [build-binaries.yaml](../../../puya/.github/workflows/build-binaries.yaml) uses workflow_call)
   - **Opportunity**: Could share setup-python-venv action across AlgoKit repos
2. **Configuration templates**:
   - `.coveragerc` config could be standardized across Python repos (currently has custom omit patterns)
   - `pyproject.toml` [tool.semantic_release] config (comprehensive, good template)
   - `.pre-commit-config.yaml` with ruff + mypy (good template for Python repos)
3. **Python version management**:
   - Adopt `.python-version` file as source of truth
   - Read from pyproject.toml `requires-python` in CI
4. **Coverage enforcement**:
   - Add `--cov-fail-under=X` to pytest config or CI workflow
   - Standardize threshold across Python repos (80% lines?)

### 7.4 Unique Patterns (Non-Issues)
1. **Dual package releases** (puyapy + algorand-python)
   - Legitimate: Compiler and stubs distributed separately
   - Version check script ensures compatibility (Evidence: [cd.yaml:72](../../../puya/.github/workflows/cd.yaml#L72))
2. **Cross-platform binary builds with code signing**
   - Appropriate for CLI compiler tool
   - Extensive platform testing (Evidence: [build-binaries.yaml:223](../../../puya/.github/workflows/build-binaries.yaml#L223) manylinux smoke tests across 11 distros)
3. **Scriv + semantic-release dual changelog**
   - Scriv used for changelog fragments (developer-facing)
   - Semantic-release for automated version/tag/publish
   - Reasonable for compiler project needing detailed changelogs
4. **test_cases/ separate from tests/**
   - Legitimate: Compiler needs example code to compile as test fixtures
   - Compile-all workflow validates all examples compile correctly (Evidence: [check-python.yaml:225](../../../puya/.github/workflows/check-python.yaml#L225))
5. **Localnet marker for integration tests**
   - Appropriate: Compiler tests need actual Algorand network for E2E validation
   - Properly isolated with pytest markers (Evidence: [pyproject.toml:110](../../../puya/pyproject.toml#L110))
6. **uv lock manual update in release**
   - Necessary workaround for python-semantic-release + uv integration
   - Evidence: [cd.yaml:100](../../../puya/.github/workflows/cd.yaml#L100) comment references python-semantic-release docs

---

## 8. Evidence Summary
- **Total Files Analyzed**: 23 key files
- **Key Evidence Files**:
  - [pyproject.toml](../../../puya/pyproject.toml) (build config, dependencies, semantic-release, pytest, coverage, ruff, mypy)
  - [.github/workflows/check-python.yaml](../../../puya/.github/workflows/check-python.yaml) (PR validation, tests, coverage)
  - [.github/workflows/cd.yaml](../../../puya/.github/workflows/cd.yaml) (release automation)
  - [.github/workflows/build-binaries.yaml](../../../puya/.github/workflows/build-binaries.yaml) (binary build matrix)
  - [.github/actions/setup-python-venv/action.yaml](../../../puya/.github/actions/setup-python-venv/action.yaml) (Python version source)
  - [.coveragerc](../../../puya/.coveragerc) (coverage config)
  - [.pre-commit-config.yaml](../../../puya/.pre-commit-config.yaml) (pre-commit hooks)
  - [docs/conf.py](../../../puya/docs/conf.py) (Sphinx config)
  - [CHANGELOG.md](../../../puya/CHANGELOG.md) (release history)
  - [README.md](../../../puya/README.md) (project overview)
  - [ARCHITECTURE.md](../../../puya/ARCHITECTURE.md) (architecture docs)
  - [stubs/pyproject.toml](../../../puya/stubs/pyproject.toml) (algorand-python stubs package)
  - [changelog.d/](../../../puya/changelog.d/) (scriv fragments)
  - [tests/](../../../puya/tests/) (test structure)
  - [test_cases/](../../../puya/test_cases/) (compiler test cases)
  - [docs/](../../../puya/docs/) (Sphinx documentation)
  - [examples/](../../../puya/examples/) (example code)
  - [.github/workflows/gh-pages.yaml](../../../puya/.github/workflows/gh-pages.yaml) (docs publishing)
  - [.github/workflows/prerelease.yaml](../../../puya/.github/workflows/prerelease.yaml) (prerelease workflow)
  - [.github/actions/build-binaries/linux/action.yaml](../../../puya/.github/actions/build-binaries/linux/action.yaml) (Linux binary build)
  - [.github/actions/build-binaries/macos/action.yaml](../../../puya/.github/actions/build-binaries/macos/action.yaml) (macOS binary build with notarization)
  - [.github/actions/build-binaries/windows/action.yaml](../../../puya/.github/actions/build-binaries/windows/action.yaml) (Windows binary build with signing)
  - [uv.lock](../../../puya/uv.lock) (dependency lockfile)
