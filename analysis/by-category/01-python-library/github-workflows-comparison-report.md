
## Executive Summary

This report compares the GitHub Actions and CI/CD configurations across 2 Python repositories in the AlgoKit ecosystem. Both repositories (algokit-subscriber-py, algokit-utils-py) use python-semantic-release for automated versioning but with significantly different versions (v10.3.1 vs v7.34.3) and distinct CI/CD architectures.

---

## 1. Repository Overview

| Repository | Workflows | CI Pattern | Release Automation |
|------------|:---------:|------------|-------------------|
| algokit-subscriber-py | 3 | Custom composite action | python-semantic-release v10.3.1 |
| algokit-utils-py | 5 | Reusable workflows (workflow_call) | python-semantic-release v7.34.3 |

---

## 2. Detailed Analysis by Repository

### 2.1 algokit-subscriber-py

#### Workflows
| File | Triggers | Purpose |
|------|----------|---------|
| `check-python.yaml` | PR, workflow_call | CI validation - linting, testing, coverage |
| `cd.yaml` | Push to main, manual | Full CI/CD + semantic-release + PyPI publish |
| `gh-pages.yaml` | workflow_call, manual | Sphinx documentation deployment |

#### Actions Used
| Action | Version | Notes |
|--------|---------|-------|
| `actions/checkout` | v4 | Code checkout |
| `actions/setup-python` | v5 | Python 3.12 setup |
| `actions/create-github-app-token` | v1 | Bot token generation |
| `actions/upload-pages-artifact` | v3 | Pages deployment |
| `actions/deploy-pages` | v4 | Pages deployment |
| `MishaKav/pytest-coverage-comment` | @main | Coverage PR comments (branch-based) |
| `python-semantic-release/python-semantic-release` | v10.3.1 | Semantic versioning |
| `pypa/gh-action-pypi-publish` | @release/v1 | PyPI publishing (branch-based) |

#### Custom Composite Action
- **Location**: `.github/actions/setup-algokit-python/action.yaml`
- **Purpose**: Consistent environment setup (Poetry, Python 3.12, AlgoKit localnet)

#### Pre-commit Hooks
- **Config File**: `.pre-commit-config.yaml`
- **Hooks**: black (formatting), ruff (linting), mypy (type checking)
- **Enforcement**: Via `poetry run pre-commit run --all-files`

#### Semantic Release
- **Config Location**: `pyproject.toml` ([tool.semantic_release] section)
- **Branches**: main only
- **Release Modes**: Beta (default on push) or Production (via workflow_dispatch toggle)
- **Tag Format**: `v{version}`
- **Commit Parser Tags**: build, chore, ci, docs, feat, fix, perf, style, refactor, test

#### Package Versions
| Package | Version |
|---------|---------|
| `python-semantic-release` | v10.3.1 (action) |
| `pytest` | ^8.4.1 |
| `pytest-cov` | ^6.2.1 |
| `mypy` | ^1.17.1 |
| `ruff` | ^0.12.9 |
| `black` | ^25.1.0 |
| `pre-commit` | ^4.2.0 |

#### Dependabot
- **Schedule**: Weekly
- **Commit Prefix**: None (default)
- **Grouping**: None

---

### 2.2 algokit-utils-py

#### Workflows
| File | Triggers | Purpose |
|------|----------|---------|
| `pr.yaml` | Pull request | Orchestrates CI checks (calls other workflows) |
| `check-python.yaml` | workflow_call | Python linting, security audit, polytest validation |
| `check-docs.yaml` | workflow_call | Documentation validation |
| `build-python.yaml` | workflow_call | Build, test, coverage on Python matrix |
| `cd.yaml` | Push to main/alpha, manual | Full CI/CD + semantic-release + PyPI publish |

#### Actions Used
| Action | Version | Notes |
|--------|---------|-------|
| `actions/checkout` | v4 | Code checkout |
| `actions/setup-python` | v5 | Python setup (3.10, 3.11, 3.12) |
| `astral-sh/setup-uv` | v5 | uv package manager |
| `actions/create-github-app-token` | v1 | Bot token generation |
| `actions/upload-artifact` | v4 | Test result artifacts |
| `MishaKav/pytest-coverage-comment` | @main | Coverage PR comments (branch-based) |
| `algorandfoundation/algokit-polytest/.../setup-polytest` | @main | Polytest setup |
| `algorandfoundation/algokit-polytest/.../run-mock-server` | @main | Mock servers (algod, indexer, kmd) |
| `aorumbayev/algokit-polytest/.../setup-polytest` | @main | Polytest (different org in check-python) |

#### Pre-commit Hooks
- **Config File**: `.pre-commit-config.yaml`
- **Hooks**: format (ruff format), generate-api-clients, lint (ruff+mypy), docs, docstrings-check, test (pytest)
- **Enforcement**: All hooks use `uv run`

#### Semantic Release
- **Config Location**: `pyproject.toml` ([tool.semantic_release] section)
- **Branches**: main (beta/production), alpha (alpha prerelease)
- **Release Modes**: Alpha (branch alpha), Beta (main non-prod), Production (main + toggle)
- **Build Command**: `uv build`
- **Version Source**: tag (default), commit (production releases)

#### Package Versions
| Package | Version |
|---------|---------|
| `python-semantic-release` | v7.34.3 (dev dependency) |
| `pytest` | >=8,<9 |
| `pytest-cov` | >=6,<7 |
| `mypy` | (configured in pyproject.toml) |
| `ruff` | (configured in pyproject.toml) |
| `pre-commit` | (configured) |

#### Dependabot
- **Schedule**: Weekly
- **Commit Prefix**: `chore(deps)`
- **Grouping**: All deps grouped, minor+patch only

---

## 3. Release Strategy Deep Dive

### 3.1 PyPI Package Configuration

| Aspect | subscriber-py | utils-py |
|--------|---------------|----------|
| **Package Name** | `algokit-subscriber` | `algokit-utils` |
| **Registry** | PyPI Public | PyPI Public |
| **Publishing Method** | Trusted publishing (OIDC) | API key (PYPI_API_KEY secret) |
| **Build Output** | wheel | wheel |

### 3.2 Build Tooling Comparison

| Aspect | subscriber-py | utils-py |
|--------|---------------|----------|
| **Package Manager** | Poetry | **uv** |
| **Build System** | `pip install build && python -m build` | `uv build` |
| **Dependency Lock** | poetry.lock | uv.lock |
| **Python Requirement** | ^3.12 | >=3.10,<4 |
| **Tested Versions** | 3.12 only | 3.10, 3.11, 3.12 (matrix) |

### 3.3 Semantic Release Configuration

| Setting | subscriber-py | utils-py |
|---------|---------------|----------|
| **Version** | v10.3.1 (GitHub Action) | v7.34.3 (dev dependency) |
| **Version Source** | pyproject.toml | Git tags |
| **Tag Format** | `v{version}` | `v{major}.{minor}.{patch}` |
| **Upload to VCS Release** | Yes | Yes |
| **Commit Message** | `{version}\n\n[skip ci] Automatically generated...` | `{version}\n\nskip-checks: true` |

### 3.4 Release Pipeline Flows

#### algokit-subscriber-py

```
Push to main (or workflow_dispatch)
        |
+---------------------------------------+
| Release Job                           |
|  * Generate GitHub App token          |
|  * Checkout (full history)            |
|  * Setup Python 3.12 + Poetry         |
|  * Start AlgoKit localnet             |
|  * Run pre-commit checks              |
|  * Run pytest                         |
+---------------------------------------+
        |
        v
+---------------------------------------+
| Semantic Release Decision             |
|  * production_release = true?         |
|    - Yes: Full release                |
|    - No:  Beta prerelease             |
+---------------------------------------+
        |
        v
+---------------------------------------+
| python-semantic-release v10.3.1       |
|  * Analyze commits                    |
|  * Bump version in pyproject.toml     |
|  * Generate changelog                 |
|  * Create git tag                     |
|  * Create GitHub release              |
+---------------------------------------+
        |
        v
+---------------------------------------+
| PyPI Publishing                       |
|  * pypa/gh-action-pypi-publish        |
|  * Trusted publishing (OIDC)          |
+---------------------------------------+
        |
        v (production_release only)
+---------------------------------------+
| Documentation Deployment              |
|  * Call gh-pages.yaml workflow        |
|  * Build Sphinx docs                  |
|  * Deploy to GitHub Pages             |
+---------------------------------------+
```

#### algokit-utils-py

```
Push to main/alpha (or workflow_dispatch)
        |
+---------------------------------------+
| CI Check Python                       |
|  * Setup Python 3.10 + uv             |
|  * Security audit (pip-audit)         |
|  * Lint (ruff + mypy)                 |
|  * Polytest validation                |
+---------------------------------------+
        |
+---------------------------------------+
| CI Check Docs                         |
|  * Setup Python 3.12                  |
|  * Docstring validation               |
|  * Docs build validation              |
+---------------------------------------+
        |
+---------------------------------------+
| CI Build Python (Matrix)              |
|  * Python 3.10, 3.11, 3.12            |
|  * Setup Polytest                     |
|  * Start mock servers                 |
|  * Generate API clients               |
|  * Run pytest with coverage           |
|  * Build wheel                        |
+---------------------------------------+
        |
        v
+---------------------------------------+
| Release Job                           |
|  * Generate GitHub App token          |
|  * Checkout (full history)            |
|  * Determine branch (alpha/main)      |
+---------------------------------------+
        |
        v
+---------------------------------------+
| Semantic Release (Branch-Based)       |
|  * Alpha branch: --prerelease alpha   |
|  * Main (non-prod): --prerelease      |
|  * Main (prod): version_source=commit |
+---------------------------------------+
        |
        v
+---------------------------------------+
| PyPI Publishing                       |
|  * Uses PYPI_API_KEY secret           |
|  * __token__ authentication           |
+---------------------------------------+
```

### 3.5 Bot Authentication

| Setting | subscriber-py | utils-py |
|---------|---------------|----------|
| **Bot Secrets** | BOT_ID, BOT_SK | BOT_ID, BOT_SK |
| **Token Generation** | `actions/create-github-app-token@v1` | `actions/create-github-app-token@v1` |

### 3.6 Documentation Deployment

| Repository | Tool | Hosting | Automation |
|------------|------|---------|------------|
| subscriber-py | Sphinx + Furo | GitHub Pages | **Yes** (gh-pages.yaml) |
| utils-py | Sphinx + Furo | GitHub Pages | **No** (workflow missing) |

---

## 4. Cross-Repository Comparison

### 4.1 Tool/Package Versions

| Package | subscriber-py | utils-py |
|---------|---------------|----------|
| `python-semantic-release` | **v10.3.1** | **v7.34.3** |
| `pytest` | ^8.4.1 | >=8,<9 |
| `pytest-cov` | ^6.2.1 | >=6,<7 |
| `mypy` | ^1.17.1 | configured |
| `ruff` | ^0.12.9 | configured |
| `black` | ^25.1.0 | **Not used** |

### 4.2 GitHub Actions Versions

| Action | subscriber-py | utils-py |
|--------|---------------|----------|
| `actions/checkout` | v4 | v4 |
| `actions/setup-python` | v5 | v5 |
| `actions/create-github-app-token` | v1 | v1 |
| `actions/upload-artifact` | - | v4 |
| `actions/upload-pages-artifact` | v3 | - |
| `actions/deploy-pages` | v4 | - |
| `astral-sh/setup-uv` | - | v5 |
| `MishaKav/pytest-coverage-comment` | @main | @main |

### 4.3 Dependabot Configuration

| Setting | subscriber-py | utils-py |
|---------|---------------|----------|
| **Enabled** | Yes | Yes |
| **Schedule** | Weekly | Weekly |
| **Commit Prefix** | None | `chore(deps)` |
| **Grouping** | None | All (minor+patch) |

### 4.4 Branch Strategy

| Branch | subscriber-py | utils-py |
|--------|---------------|----------|
| **main** | beta/production (toggle) | beta/production (toggle) |
| **alpha** | **N/A** | alpha prerelease |

### 4.5 Python Version Testing

| Repository | CI Versions | Required Version |
|------------|-------------|------------------|
| subscriber-py | 3.12 only | ^3.12 |
| utils-py | 3.10, 3.11, 3.12 | >=3.10,<4 |

### 4.6 Pre-commit Configuration

| Feature | subscriber-py | utils-py |
|---------|---------------|----------|
| **Formatter** | black | ruff format |
| **Linter** | ruff | ruff |
| **Type Checker** | mypy | mypy |
| **Test Runner** | No | Yes (pytest) |
| **Docs Check** | No | Yes |
| **API Generation** | No | Yes |

### 4.7 CI Architecture

| Feature | subscriber-py | utils-py |
|---------|---------------|----------|
| **Pattern** | Custom composite action | Reusable workflows |
| **Modularity** | Single setup action | 4 callable workflows |
| **Matrix Testing** | No | Yes |
| **Polytest** | No | Yes |
| **Mock Servers** | AlgoKit localnet | Polytest mock servers |

---

## 5. Key Inconsistencies

### 5.1 Semantic Release Version Drift
- **subscriber-py**: Uses v10.3.1 (GitHub Action)
- **utils-py**: Uses v7.34.3 (dev dependency)
- **Impact**: Major version difference (v7 vs v10) means different APIs, features, and configuration options

### 5.2 Package Manager
- **subscriber-py**: Poetry
- **utils-py**: uv (Astral)
- **Impact**: Different lockfile formats, dependency resolution, and build commands

### 5.3 Python Version Testing
- **subscriber-py**: Single version (3.12)
- **utils-py**: Matrix (3.10, 3.11, 3.12)
- **Impact**: subscriber-py may have compatibility issues on Python 3.10/3.11 not caught in CI

### 5.4 Branch Strategy
- **subscriber-py**: main only (beta/production via toggle)
- **utils-py**: main + alpha branches
- **Impact**: Different prerelease workflows and branch management

### 5.5 Workflow Architecture
- **subscriber-py**: Simple workflows with custom composite action
- **utils-py**: Complex reusable workflow pattern (workflow_call)
- **Impact**: Different maintainability patterns, harder to share configurations

### 5.6 Pre-commit Tools
- **subscriber-py**: black + ruff for formatting
- **utils-py**: ruff format only
- **Impact**: Different code style enforcement (black is more opinionated than ruff format)

### 5.7 Dependabot Configuration
- **subscriber-py**: No commit prefix, no grouping
- **utils-py**: `chore(deps)` prefix, grouped updates
- **Impact**: Different PR noise levels and changelog entries

### 5.8 GitHub Pages Deployment
- **subscriber-py**: Has gh-pages.yaml workflow
- **utils-py**: **Missing** (no automated docs deployment)
- **Impact**: utils-py documentation requires manual deployment

### 5.9 PyPI Publishing Method
- **subscriber-py**: Trusted publishing (OIDC token)
- **utils-py**: API key (PYPI_API_KEY secret)
- **Impact**: subscriber-py uses more secure, modern authentication method

### 5.10 Polytest Integration
- **subscriber-py**: None (uses AlgoKit localnet)
- **utils-py**: Full polytest integration with mock servers
- **Impact**: Different testing approaches for Algorand API interactions

### 5.11 Coverage Thresholds
- **Both**: No minimum coverage requirements enforced
- **Impact**: Code coverage can degrade over time without CI failures

### 5.12 Action Pinning
- **Both**: All actions pinned to tags/branches, not commit SHAs
- **Impact**: Supply chain security vulnerability

### 5.13 Polytest Action Source Inconsistency (utils-py only)
- **check-python.yaml**: Uses `aorumbayev/algokit-polytest@main`
- **build-python.yaml**: Uses `algorandfoundation/algokit-polytest@main`
- **Impact**: Different organizations could lead to fork divergence

### 5.14 Semantic Release Rules
- **Both repositories**: Neither has `refactor→patch` release rule configured
- **TypeScript repos**: Some include `refactor→patch`, others don't
- **Impact**: Inconsistent release behavior across Python and TypeScript ecosystems

---

## 6. Recommendations

### 6.1 Standardize Semantic Release Version
Align both repositories to the same version:
- **Recommended**: v10.x (latest, more features)
- Update utils-py from v7.34.3 to v10.x

### 6.2 Standardize Package Manager
Choose one package manager for all Python repositories:
- **Option A**: Poetry (more mature, widely used)
- **Option B**: uv (faster, newer, actively developed)
- **Recommended**: uv (faster CI, modern tooling)

### 6.3 Standardize Python Version Testing
All repositories should test against supported Python versions:
```yaml
strategy:
  matrix:
    python-version: ['3.10', '3.11', '3.12']
```

### 6.4 Standardize Branch Strategy
Decide on a consistent approach:
- **Option A**: main only with beta/production toggle
- **Option B**: main + alpha branches
- **Recommended**: Align with TypeScript repos (main/alpha/release pattern)

### 6.5 Standardize Dependabot Configuration
Apply to all repositories:
```yaml
version: 2
updates:
  - package-ecosystem: "pip"
    directory: "/"
    schedule:
      interval: "weekly"
    commit-message:
      prefix: "chore(deps)"
    groups:
      all:
        patterns:
          - "*"
        update-types:
          - "minor"
          - "patch"
```

### 6.6 Add Coverage Thresholds
Enforce minimum coverage in all repositories:
```bash
pytest --cov --cov-fail-under=80
```

### 6.7 Pin GitHub Actions to Commit SHAs
Update all workflow files to use immutable commit SHAs:
```yaml
# Instead of:
- uses: actions/checkout@v4
# Use:
- uses: actions/checkout@b4ffde65f46336ab88eb53be808477a3936bae11 # v4.1.1
```

### 6.8 Add Missing gh-pages Workflow to utils-py
Create documentation deployment workflow for utils-py following subscriber-py pattern.

### 6.9 Standardize Pre-commit Hooks
Align pre-commit configurations:
```yaml
repos:
  - repo: local
    hooks:
      - id: format
        entry: uv run ruff format
      - id: lint
        entry: uv run ruff check --fix && uv run mypy
      - id: test
        entry: uv run pytest
```

### 6.10 Use Trusted Publishing for PyPI
Migrate utils-py from API key to trusted publishing (OIDC).

### 6.11 Fix Polytest Action Source Inconsistency
Use consistent organization reference in utils-py:
```yaml
# Always use:
algorandfoundation/algokit-polytest/.github/actions/...@main
```

### 6.12 Consider Shared Workflow Repository
Create an `algorandfoundation/algokit-workflows` repository with:
- Reusable Python CI workflows
- Standard composite actions
- Consistent configurations

### 6.13 Standardize Semantic Release Rules
Decide whether `refactor→patch` should be standard across all Python repos:
- **Option A**: Add `refactor→patch` rule (aligns with some TypeScript repos)
- **Option B**: Keep current behavior (no patch for refactors)
- **Recommended**: Align with TypeScript ecosystem decision for consistency

In `pyproject.toml`:
```toml
[tool.semantic_release.commit_parser_options]
allowed_tags = ["build", "chore", "ci", "docs", "feat", "fix", "perf", "style", "refactor", "test"]
minor_tags = ["feat"]
patch_tags = ["fix", "perf", "refactor"]  # Add refactor here if choosing Option A
```

---

## 7. Summary Matrix

| Feature | subscriber-py | utils-py |
|---------|:-------------:|:--------:|
| Workflow Count | 3 | 5 |
| CI Pattern | Composite action | Reusable workflows |
| Semantic Release | Yes (v10.3.1) | Yes (v7.34.3) |
| Package Manager | Poetry | uv |
| Python Matrix | No (3.12 only) | Yes (3.10-3.12) |
| Polytest | No | Yes |
| Pre-commit | Yes | Yes |
| Dependabot Prefix | No | Yes |
| Dependabot Grouping | No | Yes |
| GitHub Pages | Yes | No |
| Coverage Thresholds | No | No |
| Actions Pinned to SHA | No | No |

### Release Strategy Summary

| Feature | subscriber-py | utils-py |
|---------|:-------------:|:--------:|
| **Semantic Release Version** | v10.3.1 | **v7.34.3** |
| **Package Manager** | Poetry | **uv** |
| **Build Command** | pip build | uv build |
| **PyPI Auth** | Trusted (OIDC) | **API Key** |
| **Alpha Branch** | No | **Yes** |
| **Docs Deployment** | Yes | **No** |
| **Python Matrix** | No | **Yes** |
| **Polytest Integration** | No | **Yes** |

### PyPI Package Details

| Package | subscriber-py | utils-py |
|---------|---------------|----------|
| **Name** | algokit-subscriber | algokit-utils |
| **Beta Tag** | main (default) | main (default) |
| **Alpha Tag** | N/A | alpha branch |
| **Production** | main (toggle) | main (toggle) |
