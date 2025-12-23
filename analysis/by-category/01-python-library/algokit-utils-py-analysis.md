# Repository Analysis: algokit-utils-py

## 1. Repository Overview
- **Tech Stack**: Python
- **Purpose Category**: Python Library (Category 1)
- **Monorepo**: Partial (includes internal api/oas-generator package for code generation, not published separately)
- **Signal Files**:
  - [pyproject.toml](../../../algokit-utils-py/pyproject.toml#L1) - Main package configuration with version 4.2.3
  - [.pre-commit-config.yaml](../../../algokit-utils-py/.pre-commit-config.yaml#L1) - Pre-commit hooks for formatting, linting, testing
  - [uv.lock](../../../algokit-utils-py/uv.lock#L1) - UV package manager lockfile
  - [.github/workflows/*.yaml](../../../algokit-utils-py/.github/workflows/) - 5 workflow files
  - [docs/source/conf.py](../../../algokit-utils-py/docs/source/conf.py#L1) - Sphinx documentation configuration
  - [src/algokit_utils/__init__.py](../../../algokit-utils-py/src/algokit_utils/__init__.py#L1) - Main package entry point
  - [api/oas-generator/](../../../algokit-utils-py/api/oas-generator/) - Internal OAS code generator tool
  - [CHANGELOG.md](../../../algokit-utils-py/CHANGELOG.md#L1) - Semantic release changelog

---

## 2. CI/CD Findings

### 2.1 Workflow Inventory
| Workflow File | Purpose | Triggers |
|---------------|---------|----------|
| [pr.yaml](../../../algokit-utils-py/.github/workflows/pr.yaml#L1) | PR validation | pull_request (all branches) |
| [check-python.yaml](../../../algokit-utils-py/.github/workflows/check-python.yaml#L1) | Python linting, auditing, polytest validation | workflow_call (reusable) |
| [check-docs.yaml](../../../algokit-utils-py/.github/workflows/check-docs.yaml#L1) | Documentation validation | workflow_call (reusable) |
| [build-python.yaml](../../../algokit-utils-py/.github/workflows/build-python.yaml#L1) | Build, test, coverage on matrix | workflow_call (reusable) |
| [cd.yaml](../../../algokit-utils-py/.github/workflows/cd.yaml#L1) | Release automation (alpha/beta/prod) | push to main/alpha (excluding docs/), workflow_dispatch |

### 2.2 Third-Party Actions
| Action | Version | Used In | Pinned |
|--------|---------|---------|--------|
| actions/checkout | v4 | all workflows | **No** (tag-based, not SHA) |
| actions/setup-python | v5 | all workflows | **No** (tag-based, not SHA) |
| astral-sh/setup-uv | v5 | all workflows | **No** (tag-based, not SHA) |
| actions/create-github-app-token | v1 | cd.yaml | **No** (tag-based, not SHA) |
| actions/upload-artifact | v4 | build-python.yaml | **No** (tag-based, not SHA) |
| MishaKav/pytest-coverage-comment | main | build-python.yaml | **No** (branch ref) |
| algorandfoundation/algokit-polytest/.github/actions/setup-polytest | main | build-python.yaml | **No** (branch ref) |
| algorandfoundation/algokit-polytest/.github/actions/run-mock-server | main | build-python.yaml (3x) | **No** (branch ref) |
| aorumbayev/algokit-polytest/.github/actions/setup-polytest | main | check-python.yaml | **No** (branch ref, different org) |

### 2.3 Runtime Versions
- **Python Version**: 3.10, 3.11, 3.12 (Source: hardcoded matrix in [build-python.yaml:10](../../../algokit-utils-py/.github/workflows/build-python.yaml#L10))
- **Python Version (checks)**: 3.10 (Source: hardcoded in [check-python.yaml:16](../../../algokit-utils-py/.github/workflows/check-python.yaml#L16))
- **Python Version (docs)**: 3.12 (Source: hardcoded in [check-docs.yaml:16](../../../algokit-utils-py/.github/workflows/check-docs.yaml#L16))
- **Python Requirement**: >=3.10,<4 (Source: [pyproject.toml:8](../../../algokit-utils-py/pyproject.toml#L8))
- **Mypy Target**: 3.10 (Source: [pyproject.toml:303](../../../algokit-utils-py/pyproject.toml#L303))

### 2.4 Release Automation
- **Mechanism**: python-semantic-release (v7.34.3 in dev dependencies)
- **Triggers**:
  - Push to main branch (production or beta release via workflow_dispatch input)
  - Push to alpha branch (alpha prerelease)
  - Manual workflow_dispatch with production_release boolean
- **Publishing**: Automated to PyPI with PYPI_API_KEY secret
- **Version Source**: Git tags ([pyproject.toml:334](../../../algokit-utils-py/pyproject.toml#L334))

### 2.5 CI/CD Gaps & Anomalies
1. **CRITICAL SECURITY RISK**: All GitHub Actions are pinned to mutable tags (v4, v5, main) instead of immutable commit SHAs
2. **Inconsistent polytest action source**: check-python.yaml uses `aorumbayev/algokit-polytest@main` while build-python.yaml uses `algorandfoundation/algokit-polytest@main` - potential fork inconsistency
3. **No commitlint**: No commit message validation workflow or commitlint configuration found
4. **Coverage comment uses continue-on-error**: [build-python.yaml:75](../../../algokit-utils-py/.github/workflows/build-python.yaml#L75) allows fork failures but masks other potential issues
5. **Complex release logic**: Three separate semantic-release commands for alpha/beta/prod with different --define flags increases maintenance burden

---

## 3. Branching Strategy Findings

### 3.1 Branch Triggers
| Workflow | Branches | Tags | Purpose |
|----------|----------|------|---------|
| pr.yaml | all (pull_request) | N/A | PR validation |
| cd.yaml | main, alpha | N/A | Release automation (alpha/beta/production) |
| check-python.yaml | N/A (reusable) | N/A | Linting, audit, polytest validation |
| check-docs.yaml | N/A (reusable) | N/A | Documentation validation |
| build-python.yaml | N/A (reusable) | N/A | Test matrix execution |

### 3.2 Commit Conventions
- **Commitlint**: No (no configuration file found)
- **Pre-commit Hooks**: Yes ([.pre-commit-config.yaml](../../../algokit-utils-py/.pre-commit-config.yaml#L1))
  - Hooks: format (ruff format), generate-api-clients, lint (ruff + mypy), docs (always passes), docstrings-check, test (pytest)
  - All hooks use `uv run` for execution
  - Pre-commit runs tests as final validation step

### 3.3 Release Branch Strategy
- **Semantic-Release Branches**: [main, alpha] ([pyproject.toml:338](../../../algokit-utils-py/pyproject.toml#L338) specifies main; alpha configured via cd.yaml)
- **Environment Branches**: None (no staging/preview branches)
- **Special Logic**:
  - `main` branch supports both beta (default) and production releases via workflow_dispatch input
  - `alpha` branch triggers alpha prereleases
  - Commit message includes `skip-checks: true` ([pyproject.toml:339](../../../algokit-utils-py/pyproject.toml#L339))

### 3.4 Trunk-Based Compliance
- **Assessment**: Partially compliant (main-focused with alpha prerelease branch)
- **Evidence**:
  - Main branch is primary development branch ([pyproject.toml:338](../../../algokit-utils-py/pyproject.toml#L338))
  - Alpha branch exists for prerelease testing ([cd.yaml:7](../../../algokit-utils-py/.github/workflows/cd.yaml#L7))
  - No long-lived feature branches enforced
  - Beta releases on main require manual workflow_dispatch with production_release=false

---

## 4. Release & Versioning Findings

### 4.1 Release Mechanism
- **Tool**: python-semantic-release v7.34.3 ([pyproject.toml:28](../../../algokit-utils-py/pyproject.toml#L28))
- **Config Location**: [tool.semantic_release] section in [pyproject.toml:330-340](../../../algokit-utils-py/pyproject.toml#L330)
- **Automation Level**: Fully automated (builds, tags, pushes to PyPI)

### 4.2 Tag Format
- **Format**: v{major}.{minor}.{patch} (semantic versioning with v prefix)
- **Source**: semantic-release default behavior with tag_commit=true ([pyproject.toml:337](../../../algokit-utils-py/pyproject.toml#L337))
- **Current Version**: 4.2.3 (from [pyproject.toml:3](../../../algokit-utils-py/pyproject.toml#L3))

### 4.3 Version Sources
| File | Field | Current Value | Role |
|------|-------|---------------|------|
| [pyproject.toml](../../../algokit-utils-py/pyproject.toml#L3) | project.version | 4.2.3 | Source of truth (updated by semantic-release) |
| [docs/source/conf.py](../../../algokit-utils-py/docs/source/conf.py#L17) | release | 3.0 | **Stale/hardcoded** (does not match actual version) |
| src/algokit_utils/__init__.py | __version__ | Not present | No __version__ attribute exported |

### 4.4 Version Propagation
- **Auto-commit**: Yes (by semantic-release)
- **Lockfile Updates**: Automatic via uv (uv.lock tracked in git)
- **Build Command**: `uv build` ([pyproject.toml:333](../../../algokit-utils-py/pyproject.toml#L333))
- **Version Source Strategy**: tag-based ([pyproject.toml:334](../../../algokit-utils-py/pyproject.toml#L334)) but switches to commit-based for production releases ([cd.yaml:106](../../../algokit-utils-py/.github/workflows/cd.yaml#L106))

### 4.5 Monorepo Version Strategy (if applicable)
- **Structure**: Not a traditional monorepo - contains internal api/oas-generator tool
- **Synchronization**: Independent versioning
  - Main package: 4.2.3 ([pyproject.toml:3](../../../algokit-utils-py/pyproject.toml#L3))
  - oas-generator: 0.1.0 ([api/oas-generator/pyproject.toml:3](../../../algokit-utils-py/api/oas-generator/pyproject.toml#L3))
- **Tool**: UV with workspace-like sources ([pyproject.toml:68-69](../../../algokit-utils-py/pyproject.toml#L68))
- **Note**: oas-generator is not published, only used for internal code generation

---

## 5. Testing Strategy Findings

### 5.1 Test Framework
- **Framework**: pytest >=8,<9 ([pyproject.toml:23](../../../algokit-utils-py/pyproject.toml#L23))
- **Config File**: [tool.pytest.ini_options] in [pyproject.toml:278-298](../../../algokit-utils-py/pyproject.toml#L278)
- **Extensions**: pytest-mock, pytest-cov, pytest-httpx, pytest-xdist (parallel execution), pytest-sugar, syrupy

### 5.2 Coverage Configuration
- **Tool**: pytest-cov >=6,<7 ([pyproject.toml:29](../../../algokit-utils-py/pyproject.toml#L29))
- **Modules Covered**: algokit_abi, algokit_algod_client, algokit_common, algokit_indexer_client, algokit_kmd_client, algokit_transact, algokit_utils ([pyproject.toml:226-232](../../../algokit-utils-py/pyproject.toml#L226))
- **Thresholds**: **NONE** (no minimum coverage requirements enforced)
- **Reporting**:
  - term-missing:skip-covered (terminal output)
  - junitxml=pytest-junit.xml (for CI artifacts)
  - MishaKav/pytest-coverage-comment for PR comments ([build-python.yaml:74](../../../algokit-utils-py/.github/workflows/build-python.yaml#L74))

### 5.3 Test Structure
- **Separation**: Mixed (unit tests for core functionality, integration tests against localnet, polytest-generated tests for API clients)
- **File Patterns**: test_*.py in tests/ directory ([pyproject.toml:280](../../../algokit-utils-py/pyproject.toml#L280))
- **Special Categories**:
  - tests/modules/* - Polytest-generated API client tests with mock server
  - tests/accounts/, tests/applications/, tests/assets/ - Core utility tests
  - tests/artifacts/ - Test fixtures and contract artifacts
- **Parallel Execution**: Enabled via pytest-xdist with `-n auto` ([pyproject.toml:288](../../../algokit-utils-py/pyproject.toml#L288))

### 5.4 CI Enforcement
- **Test Execution**: Yes (in [build-python.yaml](../../../algokit-utils-py/.github/workflows/build-python.yaml#L64))
- **Coverage Enforcement**: **No** (no minimum threshold, --cov-fail-under not used)
- **Pre-commit Enforcement**: Yes (tests run in pre-commit hook)
- **Matrix Testing**: Python 3.10, 3.11, 3.12 on ubuntu-latest

### 5.5 Testing Gaps
1. **No coverage thresholds**: Coverage is collected but no minimum requirements enforced
2. **No explicit e2e test separation**: Tests are organized by module but not explicitly categorized as unit/integration/e2e
3. **Polytest validation gaps**: check-python.yaml validates polytest config but doesn't validate transact tests ([check-python.yaml:42-49](../../../algokit-utils-py/.github/workflows/check-python.yaml#L42))
4. **Artifact retention**: Test results kept for 30 days but no long-term trending analysis

---

## 6. Documentation Findings

### 6.1 Documentation Tooling
- **Tool**: Sphinx >=8.0.0,<9 ([pyproject.toml:32](../../../algokit-utils-py/pyproject.toml#L32))
- **Config File**: [docs/source/conf.py](../../../algokit-utils-py/docs/source/conf.py#L1)
- **Theme**: Furo >=2024.8.6,<2025 ([pyproject.toml:42](../../../algokit-utils-py/pyproject.toml#L42) and [conf.py:56](../../../algokit-utils-py/docs/source/conf.py#L56))
- **Auto-generation**: sphinx-autoapi >=3.4.0,<4 ([pyproject.toml:44](../../../algokit-utils-py/pyproject.toml#L44))

### 6.2 Generation Settings
- **Theme**: furo with pygments monokai dark style
- **Extensions** (Sphinx):
  - myst_parser (Markdown support)
  - autoapi.extension (automatic API doc generation from docstrings)
  - sphinx.ext.autosectionlabel
- **Entry Points**: src/algokit_utils ([conf.py:27](../../../algokit-utils-py/docs/source/conf.py#L27))
- **Markdown Output**: sphinx-markdown-builder >=0.6.8,<0.7 for markdown generation ([pyproject.toml:45](../../../algokit-utils-py/pyproject.toml#L45))
- **Special Features**:
  - Custom doctree processing for markdown builds
  - Image path fixing for markdown output
  - Pycon/doctest block conversion to python syntax

### 6.3 Publishing Automation
- **Hosting**: GitHub Pages (inferred from README link: https://algorandfoundation.github.io/algokit-utils-py)
- **Workflow**: **MISSING** (no gh-pages deployment workflow found in .github/workflows/)
- **Triggers**: N/A (no automation detected)
- **Validation**: Yes - check-docs.yaml validates generated docs are up-to-date ([check-docs.yaml:27-30](../../../algokit-utils-py/.github/workflows/check-docs.yaml#L27))

### 6.4 Documentation Structure
- **API Docs**: Yes (via sphinx-autoapi, auto-generated from docstrings)
- **Guides/Tutorials**: Yes (docs/source/capabilities/* - 15+ capability guides)
- **Examples**: Yes (embedded in capability guides and docstrings)
- **Architecture Docs**: Yes (v3-migration-guide.md with architecture explanations)
- **Generated Output**: docs/markdown/ directory contains markdown-rendered docs for consumption by external doc sites

### 6.5 Documentation Gaps
1. **CRITICAL**: No automated deployment workflow for GitHub Pages (manual process assumed)
2. **Version mismatch**: conf.py shows release='3.0' but actual version is 4.2.3 ([conf.py:17](../../../algokit-utils-py/docs/source/conf.py#L17))
3. **Dual documentation references**: Some migration docs reference readthedocs.io instead of github.io
4. **No versioned docs**: Single docs site without version selection
5. **Docstring validation**: pydoclint configured but only checks src/, not tests/ ([pyproject.toml:173](../../../algokit-utils-py/pyproject.toml#L173))

---

## 7. Gaps, Risks, and Observations

### 7.1 Critical Gaps
1. **Security: Unpinned GitHub Actions** - All actions use mutable tags/branches instead of commit SHAs. HIGH PRIORITY for supply chain security. Evidence: [all workflows](../../../algokit-utils-py/.github/workflows/)
2. **Missing docs deployment automation** - Documentation validated in CI but no automated publishing workflow. Relies on manual deployment or external process.
3. **No commit message validation** - semantic-release depends on conventional commits but no commitlint enforcement. Relies solely on developer discipline.
4. **No coverage enforcement** - Tests run with coverage collection but no minimum thresholds, allowing coverage degradation over time.
5. **Stale documentation version** - Sphinx conf.py hardcodes version 3.0 while package is at 4.2.3. Evidence: [conf.py:17](../../../algokit-utils-py/docs/source/conf.py#L17)

### 7.2 Risks
1. **Inconsistent polytest action sources** - check-python uses aorumbayev/algokit-polytest while build-python uses algorandfoundation/algokit-polytest@main. Fork divergence risk.
2. **Complex release configuration** - Three different semantic-release invocations with various --define overrides. Maintenance burden and potential for configuration drift.
3. **Multiple Python versions without consistency check** - Workflows use different Python versions (3.10 for check, 3.12 for docs, matrix 3.10-3.12 for tests) but no explicit policy documented.
4. **Pre-commit test execution overhead** - Running full test suite in pre-commit may slow developer workflow significantly.
5. **UV build backend dependency** - Using uv_build backend (0.9.5-0.10.0) which is relatively new. May face stability issues.

### 7.3 Standardization Opportunities
1. **Shared workflow templates** - Reusable workflows (check-python, build-python, check-docs) are good pattern for reuse across AlgoKit repos
2. **Polytest integration** - Strong polytest integration for API client testing could be standardized across SDKs
3. **Pre-commit configuration** - Comprehensive pre-commit hooks including format, lint, test, docs could be template for other Python repos
4. **UV adoption** - Modern Python tooling (uv) could be standardized across AlgoKit Python projects
5. **Sphinx markdown output** - Pattern of generating markdown docs from Sphinx for consumption by doc aggregators is reusable

### 7.4 Unique Patterns (Non-Issues)
1. **Internal OAS generator package** - api/oas-generator/ is workspace-style internal tool, not published separately. Appropriate for code generation needs.
2. **Multi-module coverage** - Testing 7 separate algokit_* modules within single package reflects modular architecture.
3. **Skip-checks in release commits** - Semantic-release commits include `skip-checks: true` to avoid CI recursion. Standard practice.
4. **Polytest workflow integration** - Sophisticated use of polytest for deterministic API testing with HAR files and mock servers.
5. **Docstring-to-markdown pipeline** - Custom Sphinx extensions for markdown conversion indicate integration with external doc system (likely AlgoKit doc aggregator).

---

## 8. Evidence Summary
- **Total Files Analyzed**: 25+ key files
- **Key Evidence Files**:
  - [pyproject.toml:1](../../../algokit-utils-py/pyproject.toml#L1) (package metadata, dependencies, tool configs)
  - [pyproject.toml:330](../../../algokit-utils-py/pyproject.toml#L330) (semantic-release configuration)
  - [.github/workflows/cd.yaml:1](../../../algokit-utils-py/.github/workflows/cd.yaml#L1) (release automation with alpha/beta/prod logic)
  - [.github/workflows/build-python.yaml:1](../../../algokit-utils-py/.github/workflows/build-python.yaml#L1) (test matrix and coverage)
  - [.pre-commit-config.yaml:1](../../../algokit-utils-py/.pre-commit-config.yaml#L1) (local quality gates)
  - [docs/source/conf.py:1](../../../algokit-utils-py/docs/source/conf.py#L1) (Sphinx documentation config)
  - [pyproject.toml:226-234](../../../algokit-utils-py/pyproject.toml#L226) (coverage configuration in test-ci task)
  - [pyproject.toml:278-298](../../../algokit-utils-py/pyproject.toml#L278) (pytest configuration)
  - [README.md:12](../../../algokit-utils-py/README.md#L12) (documentation link to github.io)
  - [CHANGELOG.md:1](../../../algokit-utils-py/CHANGELOG.md#L1) (semantic-release managed changelog)
  - [.github/workflows/check-python.yaml:40](../../../algokit-utils-py/.github/workflows/check-python.yaml#L40) (polytest action inconsistency)
