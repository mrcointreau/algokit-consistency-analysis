# Repository Analysis: algorand-python-testing

## 1. Repository Overview
- **Tech Stack**: Python
- **Purpose Category**: Category 3: Python Compiler/Language Tool (Testing Framework)
- **Monorepo**: No
- **Signal Files**:
  - Configuration: [pyproject.toml](../../../algorand-python-testing/pyproject.toml), [.coveragerc](../../../algorand-python-testing/.coveragerc), [.pre-commit-config.yaml](../../../algorand-python-testing/.pre-commit-config.yaml)
  - CI/CD: [.github/workflows/ci.yaml](../../../algorand-python-testing/.github/workflows/ci.yaml), [.github/workflows/cd.yaml](../../../algorand-python-testing/.github/workflows/cd.yaml), [.github/workflows/gh-pages.yaml](../../../algorand-python-testing/.github/workflows/gh-pages.yaml)
  - Release: [CHANGELOG.md](../../../algorand-python-testing/CHANGELOG.md), semantic-release config in pyproject.toml
  - Testing: tests/ directory, pytest configuration in pyproject.toml
  - Documentation: [docs/conf.py](../../../algorand-python-testing/docs/conf.py) (Sphinx)
  - Dependency Management: [.github/dependabot.yml](../../../algorand-python-testing/.github/dependabot.yml)

---

## 2. CI/CD Findings

### 2.1 Workflow Inventory
| Workflow File | Purpose | Triggers |
|---------------|---------|----------|
| [ci.yaml](../../../algorand-python-testing/.github/workflows/ci.yaml) | PR validation and testing | workflow_call, pull_request, schedule (Monday 8 AM UTC) |
| [cd.yaml](../../../algorand-python-testing/.github/workflows/cd.yaml) | Continuous delivery and release | push to main (paths-ignore: docs/**, scripts/**, examples/**, tests/**), workflow_dispatch |
| [gh-pages.yaml](../../../algorand-python-testing/.github/workflows/gh-pages.yaml) | Documentation publishing | workflow_call, workflow_dispatch |

### 2.2 Third-Party Actions
| Action | Version | Used In | Pinned |
|--------|---------|---------|--------|
| actions/checkout | v4 | ci.yaml, cd.yaml, gh-pages.yaml | **No** (tag-based) |
| actions/setup-python | v5 | ci.yaml, cd.yaml, gh-pages.yaml | **No** (tag-based) |
| actions/upload-artifact | v4 | ci.yaml, cd.yaml | **No** (tag-based) |
| actions/upload-pages-artifact | v3 | gh-pages.yaml | **No** (tag-based) |
| actions/deploy-pages | v4 | gh-pages.yaml | **No** (tag-based) |
| pypa/gh-action-pypi-publish | release/v1 | cd.yaml | **No** (branch-based) |
| python-semantic-release/python-semantic-release | master | cd.yaml | **No** (branch-based) |

**SECURITY FINDINGS**:
- **HIGH PRIORITY**: All GitHub Actions are pinned to mutable references (tags or branches), not immutable commit SHAs
- **CRITICAL**: `python-semantic-release/python-semantic-release@master` pinned to branch (Evidence: [cd.yaml:80](../../../algorand-python-testing/.github/workflows/cd.yaml#L80))
- **CRITICAL**: `pypa/gh-action-pypi-publish@release/v1` pinned to branch (Evidence: [cd.yaml:88](../../../algorand-python-testing/.github/workflows/cd.yaml#L88))
- **HIGH**: All other actions pinned to tags (v3, v4, v5) instead of commit SHAs, exposing supply chain security risk

### 2.3 Runtime Versions
- **Python Version**: 3.12 (Source: hardcoded in workflows)
  - Evidence: [ci.yaml:19](../../../algorand-python-testing/.github/workflows/ci.yaml#L19), [cd.yaml:56](../../../algorand-python-testing/.github/workflows/cd.yaml#L56), [gh-pages.yaml:24](../../../algorand-python-testing/.github/workflows/gh-pages.yaml#L24)
  - Matrix testing: Python 3.12 and 3.13 (Evidence: [ci.yaml:47](../../../algorand-python-testing/.github/workflows/ci.yaml#L47))
  - pyproject.toml requires-python: `>=3.12` (Evidence: [pyproject.toml:10](../../../algorand-python-testing/pyproject.toml#L10))

### 2.4 Release Automation
- **Mechanism**: python-semantic-release (fully automated)
- **Triggers**: Automatic on push to main branch (with path exclusions), manual via workflow_dispatch
- **Publishing**: Trusted publishing to PyPI via pypa/gh-action-pypi-publish (Evidence: [cd.yaml:86-90](../../../algorand-python-testing/.github/workflows/cd.yaml#L86-L90))
- **Prerelease Support**: Configurable via workflow_dispatch input, defaults to true (Evidence: [cd.yaml:15-19](../../../algorand-python-testing/.github/workflows/cd.yaml#L15-L19))

### 2.5 CI/CD Gaps & Anomalies
1. **Security Risk**: No actions pinned to commit SHAs, only tags/branches
2. **Path-based Triggers**: CD workflow excludes docs/**, scripts/**, examples/**, tests/** which means changes to only those paths won't trigger releases (Evidence: [cd.yaml:7-11](../../../algorand-python-testing/.github/workflows/cd.yaml#L7-L11))
3. **LocalNet Dependency**: CI/CD workflows require AlgoKit LocalNet to be running (Evidence: [ci.yaml:26](../../../algorand-python-testing/.github/workflows/ci.yaml#L26), [cd.yaml:60](../../../algorand-python-testing/.github/workflows/cd.yaml#L60))
4. **Test Execution in CD**: Full test suite runs during CD workflow before release (Evidence: [cd.yaml:71-75](../../../algorand-python-testing/.github/workflows/cd.yaml#L71-L75))
5. **Artifact Retention**: Coverage reports retained for 14 days (Evidence: [ci.yaml:77](../../../algorand-python-testing/.github/workflows/ci.yaml#L77))

---

## 3. Branching Strategy Findings

### 3.1 Branch Triggers
| Workflow | Branches | Tags | Purpose |
|----------|----------|------|---------|
| ci.yaml | All PRs | N/A | PR validation and testing |
| cd.yaml | main | N/A | Automated releases |
| gh-pages.yaml | N/A (workflow_call/dispatch only) | N/A | Documentation publishing |

### 3.2 Commit Conventions
- **Commitlint**: No (no commitlint config found)
- **Pre-commit Hooks**: Yes (Evidence: [.pre-commit-config.yaml](../../../algorand-python-testing/.pre-commit-config.yaml))
  - Hooks: Single local hook running `hatch run pre_commit` (Evidence: [.pre-commit-config.yaml:7](../../../algorand-python-testing/.pre-commit-config.yaml#L7))
  - Pre-commit task includes: linting (black, ruff), type checking (mypy), examples validation (Evidence: [pyproject.toml:71-76](../../../algorand-python-testing/pyproject.toml#L71-L76))
- **Semantic Commit Recognition**: Configured via semantic-release (Evidence: [pyproject.toml:350-353](../../../algorand-python-testing/pyproject.toml#L350-L353))
  - Allowed tags: build, chore, ci, docs, feat, fix, perf, style, refactor, test
  - Minor tags: feat
  - Patch tags: fix, perf, docs, chore, ci, refactor

### 3.3 Release Branch Strategy
- **Semantic-Release Branches**: [main] with prerelease support (Evidence: [pyproject.toml:345-348](../../../algorand-python-testing/pyproject.toml#L345-L348))
  - Main branch configured with `prerelease_token = "beta"` but `prerelease = false`
  - Current version shows beta: `1.2.0-beta.3` (Evidence: [pyproject.toml:7](../../../algorand-python-testing/pyproject.toml#L7))
- **Environment Branches**: None

### 3.4 Trunk-Based Compliance
- **Assessment**: Fully compliant
- **Evidence**: Single main branch for releases, no long-lived feature/develop branches, prerelease support via configuration rather than branches

---

## 4. Release & Versioning Findings

### 4.1 Release Mechanism
- **Tool**: python-semantic-release
- **Config File**: pyproject.toml [tool.semantic_release] section (Evidence: [pyproject.toml:336-360](../../../algorand-python-testing/pyproject.toml#L336-L360))
- **Automation Level**: Fully automated (commit, tag, build, publish)

### 4.2 Tag Format
- **Format**: v{version} (e.g., v1.2.0)
- **Source**: semantic-release config (Evidence: [pyproject.toml:342](../../../algorand-python-testing/pyproject.toml#L342))

### 4.3 Version Sources
| File | Field | Current Value | Role |
|------|-------|---------------|------|
| [pyproject.toml](../../../algorand-python-testing/pyproject.toml#L7) | project.version | 1.2.0-beta.3 | Source of truth (managed by semantic-release) |
| N/A | __version__ | Not found | No __version__ export in __init__.py files |

**Version Source Configuration**:
- semantic-release manages: `version_toml = ["pyproject.toml:project.version"]` (Evidence: [pyproject.toml:339](../../../algorand-python-testing/pyproject.toml#L339))

### 4.4 Version Propagation
- **Auto-commit**: Yes (By: python-semantic-release)
  - Commit message format: `{version}\n\n[skip ci]` (Evidence: [pyproject.toml:341](../../../algorand-python-testing/pyproject.toml#L341))
- **Lockfile Updates**: N/A (Python project uses pip, no lockfile committed)

### 4.5 Monorepo Version Strategy (if applicable)
- **N/A**: Not a monorepo

### 4.6 Versioning Gaps
1. **No __version__ Export**: Package doesn't export `__version__` in `__init__.py` files for runtime version checking
2. **Beta Version State**: Current version is beta (1.2.0-beta.3) but semantic-release config shows `prerelease = false` on main branch (Evidence: [pyproject.toml:348](../../../algorand-python-testing/pyproject.toml#L348))

---

## 5. Testing Strategy Findings

### 5.1 Test Framework
- **Framework**: pytest
- **Config File**: pyproject.toml [tool.pytest.ini_options] (Evidence: [pyproject.toml:332-334](../../../algorand-python-testing/pyproject.toml#L332-L334))

### 5.2 Coverage Configuration
- **Tool**: pytest-cov + coverage.py
- **Config File**: [.coveragerc](../../../algorand-python-testing/.coveragerc)
- **Thresholds**: None enforced (no --cov-fail-under flag found)
- **Reporting**: XML for CI, HTML for local development
  - CI: `--cov-report=xml --cov-report=term` (Evidence: [pyproject.toml:140](../../../algorand-python-testing/pyproject.toml#L140))
  - Local: `--cov-report=html` with browser auto-open (Evidence: [pyproject.toml:86-87](../../../algorand-python-testing/pyproject.toml#L86-L87))
- **Coverage Source**: `source = src/algopy` (Evidence: [.coveragerc:2](../../../algorand-python-testing/.coveragerc#L2))
- **Exclusions**: TYPE_CHECKING blocks, abstract methods, InternalError raises (Evidence: [.coveragerc:7-10](../../../algorand-python-testing/.coveragerc#L7-L10))

### 5.3 Test Structure
- **Separation**: Mixed structure with categorized subdirectories
  - Root test files: test_array.py, test_context.py, test_miscellaneous_op.py, test_op.py
  - Subdirectories: arc4/, avm12/, contexts/, dynamic_itxn_group/, models/, primitives/, state/, utilities/
- **File Patterns**: test_*.py (standard pytest pattern)
- **Artifacts**: tests/artifacts/ directory contains ARC32/ARC56 contract artifacts for testing
- **Examples**: Separate examples/ directory with tests (e.g., examples/auction/test_contract.py)

### 5.4 CI Enforcement
- **Test Execution**: Yes
  - Main CI job: `hatch run check` includes validation (Evidence: [ci.yaml:29](../../../algorand-python-testing/.github/workflows/ci.yaml#L29))
  - Matrix testing: Python 3.12 and 3.13 (Evidence: [ci.yaml:43-68](../../../algorand-python-testing/.github/workflows/ci.yaml#L43-L68))
  - Examples testing: Separate matrix job (Evidence: [ci.yaml:67-68](../../../algorand-python-testing/.github/workflows/ci.yaml#L67-L68))
  - CD workflow: Full tests run before release (Evidence: [cd.yaml:71-75](../../../algorand-python-testing/.github/workflows/cd.yaml#L71-L75))
- **Coverage Enforcement**: No (no threshold enforced via --cov-fail-under)
- **Coverage Upload**: Coverage artifacts uploaded for Python 3.13 only (Evidence: [ci.yaml:70-77](../../../algorand-python-testing/.github/workflows/ci.yaml#L70-L77))

### 5.5 Testing Gaps
1. **No Coverage Thresholds**: Coverage collected but not enforced, no minimum threshold configured
2. **No Coverage Reporting**: No CodeCov or similar coverage reporting service integration
3. **Parallel Execution**: Tests use `pytest-xdist` with `-n auto` (Evidence: [pyproject.toml:333](../../../algorand-python-testing/pyproject.toml#L333))

---

## 6. Documentation Findings

### 6.1 Documentation Tooling
- **Tool**: Sphinx
- **Config File**: [docs/conf.py](../../../algorand-python-testing/docs/conf.py)

### 6.2 Generation Settings
- **Theme**: Furo (Evidence: [docs/conf.py:49](../../../algorand-python-testing/docs/conf.py#L49))
- **Extensions**:
  - sphinx.ext.githubpages
  - sphinx.ext.intersphinx
  - sphinx.ext.doctest
  - sphinx_copybutton
  - myst_parser (Markdown support)
  - autodoc2 (automatic API documentation)
  - sphinxmermaid (diagram support)
  - Evidence: [docs/conf.py:18-26](../../../algorand-python-testing/docs/conf.py#L18-L26)
- **API Documentation**: autodoc2 with auto_mode for `src/algopy_testing` and `src/_algopy_testing` (Evidence: [docs/conf.py:61-70](../../../algorand-python-testing/docs/conf.py#L61-L70))
- **Build Commands**:
  - Build: `hatch run docs:build` (Evidence: [pyproject.toml:173](../../../algorand-python-testing/pyproject.toml#L173))
  - Dev mode: `hatch run docs:dev` (Evidence: [pyproject.toml:174](../../../algorand-python-testing/pyproject.toml#L174))
  - Doctest: `hatch run docs:test` (Evidence: [pyproject.toml:171](../../../algorand-python-testing/pyproject.toml#L171))

### 6.3 Publishing Automation
- **Hosting**: GitHub Pages
- **Workflow**: [gh-pages.yaml](../../../algorand-python-testing/.github/workflows/gh-pages.yaml)
- **Triggers**: workflow_call, workflow_dispatch (manual)
- **Process**:
  1. Run doctests (Evidence: [gh-pages.yaml:28](../../../algorand-python-testing/.github/workflows/gh-pages.yaml#L28))
  2. Build docs (Evidence: [gh-pages.yaml:31](../../../algorand-python-testing/.github/workflows/gh-pages.yaml#L31))
  3. Upload to GitHub Pages (Evidence: [gh-pages.yaml:34-36](../../../algorand-python-testing/.github/workflows/gh-pages.yaml#L34-L36))
  4. Deploy (Evidence: [gh-pages.yaml:39](../../../algorand-python-testing/.github/workflows/gh-pages.yaml#L39))

### 6.4 Documentation Structure
- **API Docs**: Yes (auto-generated via autodoc2)
- **Guides/Tutorials**: Yes
  - Main guides: algopy.md, coverage.md, examples.md, faq.md
  - Testing guide subdirectory with multiple topics: concepts, contract-testing, signature-testing, state-management, subroutines, transactions, opcodes, arc4-types, avm-types
  - Evidence: docs/ directory structure
- **Examples**: Yes (examples/ directory with 7 example projects, each with tests)
- **Architecture Docs**: No dedicated ARCHITECTURE.md found

### 6.5 Documentation Gaps
1. **Manual Trigger Only**: Documentation publishing requires manual workflow_dispatch, not automatic on releases
2. **No Automatic Versioning**: Docs don't appear to be versioned per release
3. **Doctest Enforcement**: Doctests run in CI but only during doc builds (Evidence: [ci.yaml:41](../../../algorand-python-testing/.github/workflows/ci.yaml#L41))

---

## 7. Gaps, Risks, and Observations

### 7.1 Critical Gaps
1. **No Coverage Thresholds**: Coverage is collected but not enforced. No minimum coverage requirement could allow quality degradation over time.
   - Evidence: [pyproject.toml:84](../../../algorand-python-testing/pyproject.toml#L84), [pyproject.toml:140](../../../algorand-python-testing/pyproject.toml#L140), [.coveragerc](../../../algorand-python-testing/.coveragerc)
2. **No __version__ Export**: Package doesn't provide runtime version access, making it difficult for users to programmatically check installed version.

### 7.2 Risks

**Security Risks (P0)**:
1. **Unpinned GitHub Actions (Supply Chain Risk)**: All actions pinned to mutable tags/branches
   - python-semantic-release@master (branch-based) - Evidence: [cd.yaml:80](../../../algorand-python-testing/.github/workflows/cd.yaml#L80)
   - pypa/gh-action-pypi-publish@release/v1 (branch-based) - Evidence: [cd.yaml:88](../../../algorand-python-testing/.github/workflows/cd.yaml#L88)
   - All other actions pinned to tags (v3, v4, v5) instead of commit SHAs
   - **Impact**: Supply chain compromise possible if action repositories are compromised

**Reliability Risks**:
2. **No Coverage Enforcement**: Tests run but no quality gate for coverage percentage
3. **LocalNet Dependency**: CI/CD requires AlgoKit LocalNet, adding external dependency and potential flakiness
   - Evidence: [ci.yaml:26](../../../algorand-python-testing/.github/workflows/ci.yaml#L26), [cd.yaml:60](../../../algorand-python-testing/.github/workflows/cd.yaml#L60)

**Maintainability Risks**:
4. **Manual Documentation Publishing**: Docs not automatically published on releases, requires manual trigger
5. **Beta Version Mismatch**: Current version is beta (1.2.0-beta.3) but semantic-release config shows prerelease=false on main
   - Evidence: [pyproject.toml:7](../../../algorand-python-testing/pyproject.toml#L7), [pyproject.toml:348](../../../algorand-python-testing/pyproject.toml#L348)

### 7.3 Standardization Opportunities
1. **Reusable Workflow Pattern**: CI workflow structure (lint → type check → test matrix) could be templated for other Python repos
2. **Coverage Configuration**: Standardize coverage thresholds across AlgoKit Python projects (e.g., 80% lines, 75% branches)
3. **Action Pinning**: Implement organization-wide policy to pin all GitHub Actions to commit SHAs
4. **Pre-commit Configuration**: Standardize pre-commit hook configuration across Python projects
5. **Documentation Automation**: Auto-publish docs on release rather than manual trigger

### 7.4 Unique Patterns (Non-Issues)
1. **Testing Framework Purpose**: As a testing framework, this repo appropriately has extensive test coverage and multiple test environments
2. **LocalNet Requirement**: Appropriate for a tool that tests Algorand smart contracts; requires blockchain simulation
3. **Multiple Python Versions**: Matrix testing across Python 3.12 and 3.13 aligns with the package's support range
4. **Separate Examples Environment**: Dedicated examples/ directory with own test environment ensures examples stay functional
   - Evidence: [pyproject.toml:176-206](../../../algorand-python-testing/pyproject.toml#L176-L206)
5. **Scripts for Artifact Management**: Custom scripts for refreshing test artifacts and validating examples are appropriate for a testing framework
   - Evidence: [pyproject.toml:68-70](../../../algorand-python-testing/pyproject.toml#L68-L70)
6. **Comprehensive Linting**: Extensive ruff configuration with 20+ rule categories appropriate for a library that others depend on
   - Evidence: [pyproject.toml:220-264](../../../algorand-python-testing/pyproject.toml#L220-L264)
7. **Path-based CD Exclusions**: Excluding docs/**, scripts/**, examples/**, tests/** from triggering releases is sensible to avoid unnecessary version bumps
   - Evidence: [cd.yaml:7-11](../../../algorand-python-testing/.github/workflows/cd.yaml#L7-L11)

---

## 8. Evidence Summary
- **Total Files Analyzed**: 15
- **Key Evidence Files**:
  - [pyproject.toml](../../../algorand-python-testing/pyproject.toml) (project config, dependencies, tools, semantic-release, hatch environments)
  - [.github/workflows/ci.yaml](../../../algorand-python-testing/.github/workflows/ci.yaml) (PR validation, test matrix)
  - [.github/workflows/cd.yaml](../../../algorand-python-testing/.github/workflows/cd.yaml) (release automation)
  - [.github/workflows/gh-pages.yaml](../../../algorand-python-testing/.github/workflows/gh-pages.yaml) (documentation publishing)
  - [.pre-commit-config.yaml](../../../algorand-python-testing/.pre-commit-config.yaml) (pre-commit hooks)
  - [.coveragerc](../../../algorand-python-testing/.coveragerc) (coverage configuration)
  - [docs/conf.py](../../../algorand-python-testing/docs/conf.py) (Sphinx configuration)
  - [.github/dependabot.yml](../../../algorand-python-testing/.github/dependabot.yml) (dependency updates)
  - [src/_algopy_testing/__init__.py](../../../algorand-python-testing/src/_algopy_testing/__init__.py) (package exports)
  - README.md (project overview)

---

## 9. Analysis Metadata
- **Repository**: algorand-python-testing
- **Analysis Date**: 2025-12-23
- **Category**: Python Compiler/Language Tool (Testing Framework)
- **Tech Stack**: Python
- **Trunk-Based Compliance**: Fully compliant
- **Release Automation**: Fully automated (python-semantic-release)
- **Test Framework**: pytest with matrix testing (Python 3.12, 3.13)
- **Documentation**: Sphinx with GitHub Pages
- **Critical Security Issues**: 7 unpinned GitHub Actions
