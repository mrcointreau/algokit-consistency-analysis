# Repository Analysis: algokit-subscriber-py

## 1. Repository Overview
- **Tech Stack**: Python
- **Purpose Category**: Python Library (Category 1)
- **Monorepo**: No
- **Signal Files**:
  - [pyproject.toml](../../../algokit-subscriber-py/pyproject.toml) - Python project configuration, dependencies, and tool settings
  - [.pre-commit-config.yaml](../../../algokit-subscriber-py/.pre-commit-config.yaml) - Pre-commit hooks for code quality
  - [.github/workflows/check-python.yaml](../../../algokit-subscriber-py/.github/workflows/check-python.yaml) - PR validation workflow
  - [.github/workflows/cd.yaml](../../../algokit-subscriber-py/.github/workflows/cd.yaml) - Continuous delivery/release workflow
  - [.github/workflows/gh-pages.yaml](../../../algokit-subscriber-py/.github/workflows/gh-pages.yaml) - Documentation publishing workflow
  - [.github/actions/setup-algokit-python/action.yaml](../../../algokit-subscriber-py/.github/actions/setup-algokit-python/action.yaml) - Custom composite action
  - [docs/conf.py](../../../algokit-subscriber-py/docs/conf.py) - Sphinx documentation configuration
  - [CHANGELOG.md](../../../algokit-subscriber-py/CHANGELOG.md) - Change log
  - [poetry.lock](../../../algokit-subscriber-py/poetry.lock) - Poetry dependency lockfile

---

## 2. CI/CD Findings

### 2.1 Workflow Inventory
| Workflow File | Purpose | Triggers |
|---------------|---------|----------|
| [check-python.yaml](../../../algokit-subscriber-py/.github/workflows/check-python.yaml#L1-L6) | PR validation - linting, testing, coverage | `workflow_call`, `pull_request` |
| [cd.yaml](../../../algokit-subscriber-py/.github/workflows/cd.yaml#L1-L18) | CD - semantic release and PyPI publish | `push` to `main`, `workflow_dispatch` |
| [gh-pages.yaml](../../../algokit-subscriber-py/.github/workflows/gh-pages.yaml#L1-L6) | Documentation publishing | `workflow_call`, `workflow_dispatch` |

### 2.2 Third-Party Actions
| Action | Version | Used In | Pinned |
|--------|---------|---------|--------|
| actions/checkout | v4 | check-python.yaml, cd.yaml, gh-pages.yaml | **No** (tag-based) |
| actions/setup-python | v5 | setup-algokit-python action, gh-pages.yaml | **No** (tag-based) |
| MishaKav/pytest-coverage-comment | main | check-python.yaml | **No** (branch-based) |
| actions/create-github-app-token | v1 | cd.yaml | **No** (tag-based) |
| python-semantic-release/python-semantic-release | v10.3.1 | cd.yaml | **No** (tag-based) |
| pypa/gh-action-pypi-publish | release/v1 | cd.yaml | **No** (branch-based) |
| actions/upload-pages-artifact | v3 | gh-pages.yaml | **No** (tag-based) |
| actions/deploy-pages | v4 | gh-pages.yaml | **No** (tag-based) |

**SECURITY FINDINGS**:
- **HIGH PRIORITY**: All GitHub Actions are pinned to tags or branches, not commit SHAs
- **CRITICAL**: [actions/checkout@v4](../../../algokit-subscriber-py/.github/workflows/check-python.yaml#L12) - tag-based reference vulnerable to tag manipulation
- **CRITICAL**: [actions/setup-python@v5](../../../algokit-subscriber-py/.github/actions/setup-algokit-python/action.yaml#L11) - tag-based reference
- **CRITICAL**: [MishaKav/pytest-coverage-comment@main](../../../algokit-subscriber-py/.github/workflows/check-python.yaml#L50) - branch-based reference is highest risk
- **CRITICAL**: [pypa/gh-action-pypi-publish@release/v1](../../../algokit-subscriber-py/.github/workflows/cd.yaml#L78) - branch-based reference used for PyPI publishing (supply chain risk)
- **Supply chain security risk**: 8 action references vulnerable to tag/branch manipulation

### 2.3 Runtime Versions
- **Python Version**: 3.12 (Source: [pyproject.toml:9](../../../algokit-subscriber-py/pyproject.toml#L9) `python = "^3.12"`, hardcoded in [setup-algokit-python/action.yaml:13](../../../algokit-subscriber-py/.github/actions/setup-algokit-python/action.yaml#L13) and [gh-pages.yaml:24](../../../algokit-subscriber-py/.github/workflows/gh-pages.yaml#L24))

### 2.4 Release Automation
- **Mechanism**: python-semantic-release (Evidence: [cd.yaml:61-74](../../../algokit-subscriber-py/.github/workflows/cd.yaml#L61-L74))
- **Triggers**:
  - Automatic on push to main (beta releases by default - Evidence: [cd.yaml:6-8](../../../algokit-subscriber-py/.github/workflows/cd.yaml#L6-L8))
  - Manual workflow_dispatch with production_release toggle (Evidence: [cd.yaml:11-17](../../../algokit-subscriber-py/.github/workflows/cd.yaml#L11-L17))
- **PyPI Publishing**: Automated using trusted publishing (Evidence: [cd.yaml:76-81](../../../algokit-subscriber-py/.github/workflows/cd.yaml#L76-L81))
- **Documentation Publishing**: Conditional on production releases only (Evidence: [cd.yaml:83-92](../../../algokit-subscriber-py/.github/workflows/cd.yaml#L83-L92))

### 2.5 CI/CD Gaps & Anomalies
1. **Unpinned Actions**: All 8 GitHub Actions use tag or branch references instead of commit SHAs, creating supply chain security vulnerabilities
2. **Duplicate Python Setup Logic**: Python 3.12 is hardcoded in two locations ([setup-algokit-python/action.yaml:13](../../../algokit-subscriber-py/.github/actions/setup-algokit-python/action.yaml#L13) and [gh-pages.yaml:24](../../../algokit-subscriber-py/.github/workflows/gh-pages.yaml#L24)), creating maintenance burden
3. **No Python Version File**: No `.python-version` file for local development consistency
4. **Beta by Default**: Releases to main are beta by default unless manually triggered with production flag (Evidence: [cd.yaml:61-74](../../../algokit-subscriber-py/.github/workflows/cd.yaml#L61-L74))
5. **Tests Run Twice**: Tests are executed both in check-python.yaml and cd.yaml (Evidence: [check-python.yaml:40-46](../../../algokit-subscriber-py/.github/workflows/check-python.yaml#L40-L46) and [cd.yaml:50-54](../../../algokit-subscriber-py/.github/workflows/cd.yaml#L50-L54))

---

## 3. Branching Strategy Findings

### 3.1 Branch Triggers
| Workflow | Branches | Tags | Purpose |
|----------|----------|------|---------|
| check-python.yaml | Any (pull_request) | N/A | PR validation |
| cd.yaml | main | N/A | Release automation |
| gh-pages.yaml | N/A (workflow_call only) | N/A | Documentation deployment |

### 3.2 Commit Conventions
- **Commitlint**: No (No commitlint.config.* file found)
- **Pre-commit Hooks**: Yes (Evidence: [.pre-commit-config.yaml](../../../algokit-subscriber-py/.pre-commit-config.yaml#L1-L32))
  - Hooks configured: black (code formatting), ruff (linting), mypy (type checking)
  - **Note**: No commit message validation hooks present

### 3.3 Release Branch Strategy
- **Semantic-Release Branches**: [main] (Evidence: [pyproject.toml:147-150](../../../algokit-subscriber-py/pyproject.toml#L147-L150))
- **Environment Branches**: None
- **Prerelease Configuration**: Beta prerelease token configured but not used for separate branch (Evidence: [pyproject.toml:149](../../../algokit-subscriber-py/pyproject.toml#L149))

### 3.4 Trunk-Based Compliance
- **Assessment**: Fully compliant
- **Evidence**:
  - Single main branch for releases (Evidence: [pyproject.toml:147-150](../../../algokit-subscriber-py/pyproject.toml#L147-L150))
  - No long-lived release branches
  - Beta/production releases controlled via workflow_dispatch input parameter rather than branches (Evidence: [cd.yaml:11-17](../../../algokit-subscriber-py/.github/workflows/cd.yaml#L11-L17))

---

## 4. Release & Versioning Findings

### 4.1 Release Mechanism
- **Tool**: python-semantic-release v10.3.1
- **Config File**: [pyproject.toml](../../../algokit-subscriber-py/pyproject.toml#L140-L176) ([tool.semantic_release] section)
- **Automation Level**: Fully automated (commit, tag, changelog, PyPI publish)

### 4.2 Tag Format
- **Format**: v1.2.3
- **Source**: [pyproject.toml:144](../../../algokit-subscriber-py/pyproject.toml#L144) `tag_format = "v{version}"`

### 4.3 Version Sources
| File | Field | Current Value | Role |
|------|-------|---------------|------|
| [pyproject.toml:3](../../../algokit-subscriber-py/pyproject.toml#L3) | tool.poetry.version | 1.0.1 | Source of truth (managed by semantic-release) |
| [pyproject.toml:141](../../../algokit-subscriber-py/pyproject.toml#L141) | tool.semantic_release.version_toml | ["pyproject.toml:tool.poetry.version"] | Configured version source |
| [src/algokit_subscriber/__init__.py](../../../algokit-subscriber-py/src/algokit_subscriber/__init__.py) | N/A | No __version__ export | Not used |

### 4.4 Version Propagation
- **Auto-commit**: Yes (By: python-semantic-release - Evidence: [pyproject.toml:143](../../../algokit-subscriber-py/pyproject.toml#L143))
- **Lockfile Updates**: Automatic via poetry (Evidence: [poetry.lock](../../../algokit-subscriber-py/poetry.lock) committed to repository)
- **Commit Message Format**: `{version}\n\n[skip ci] Automatically generated by python-semantic-release` (Evidence: [pyproject.toml:143](../../../algokit-subscriber-py/pyproject.toml#L143))

### 4.5 Monorepo Version Strategy
- **N/A**: Not a monorepo

### 4.6 Versioning Gaps
1. **No __version__ export**: [src/algokit_subscriber/__init__.py](../../../algokit-subscriber-py/src/algokit_subscriber/__init__.py#L1-L28) does not export `__version__` attribute for programmatic version access
2. **Dual release modes**: Beta vs production releases controlled by manual workflow_dispatch parameter rather than conventional branch-based strategy (Evidence: [cd.yaml:61-74](../../../algokit-subscriber-py/.github/workflows/cd.yaml#L61-L74))

---

## 5. Testing Strategy Findings

### 5.1 Test Framework
- **Framework**: pytest
- **Config File**: [pyproject.toml](../../../algokit-subscriber-py/pyproject.toml#L127-L128) [tool.pytest.ini_options] section
- **Configuration**: `pythonpath = ["src", "tests"]` (Evidence: [pyproject.toml:128](../../../algokit-subscriber-py/pyproject.toml#L128))

### 5.2 Coverage Configuration
- **Tool**: pytest-cov (Evidence: [pyproject.toml:19](../../../algokit-subscriber-py/pyproject.toml#L19))
- **Thresholds**: **NONE** - No coverage thresholds configured in pyproject.toml
- **Reporting**: Terminal output + PR comment (Evidence: [check-python.yaml:46](../../../algokit-subscriber-py/check-python.yaml#L46) and [check-python.yaml:48-53](../../../algokit-subscriber-py/.github/workflows/check-python.yaml#L48-L53))
- **Coverage Arguments**: `--cov` without specific targets or fail-under threshold (Evidence: [check-python.yaml:46](../../../algokit-subscriber-py/.github/workflows/check-python.yaml#L46))

### 5.3 Test Structure
- **Separation**: All mixed in single tests/ directory (Evidence: tests/ listing)
- **File Patterns**: test_*.py (pytest convention)
- **Test Count**: 19 test files covering various scenarios:
  - Balance changes, events, filters, transformations
  - Catchup with indexer, heartbeat, sync strategies
  - Complex transactions, multiple filters
- **Test Fixtures**: [filter_fixture.py](../../../algokit-subscriber-py/tests/filter_fixture.py), [accounts.py](../../../algokit-subscriber-py/tests/accounts.py), [transactions.py](../../../algokit-subscriber-py/tests/transactions.py)

### 5.4 CI Enforcement
- **Test Execution**: Yes (In workflows: [check-python.yaml:40-46](../../../algokit-subscriber-py/.github/workflows/check-python.yaml#L40-L46) and [cd.yaml:50-54](../../../algokit-subscriber-py/.github/workflows/cd.yaml#L50-L54))
- **Coverage Enforcement**: **No** - Tests run with `--cov` but no `--cov-fail-under` threshold
- **Coverage Reporting**: Yes via [MishaKav/pytest-coverage-comment@main](../../../algokit-subscriber-py/.github/workflows/check-python.yaml#L50)
- **Matrix Testing**: No - single Python version (3.12) tested

### 5.5 Testing Gaps
1. **No Coverage Thresholds**: No minimum coverage requirements enforced, tests can pass with degrading coverage
2. **No [tool.coverage.report] section**: Missing coverage configuration for branch coverage, exclusions, etc.
3. **Single Python Version Testing**: Only tests Python 3.12 despite accepting `^3.12` (Evidence: [pyproject.toml:9](../../../algokit-subscriber-py/pyproject.toml#L9))
4. **Tests Run Twice**: Redundant test execution in both check-python.yaml and cd.yaml workflows

---

## 6. Documentation Findings

### 6.1 Documentation Tooling
- **Tool**: Sphinx
- **Config File**: [docs/conf.py](../../../algokit-subscriber-py/docs/conf.py)

### 6.2 Generation Settings
- **Theme**: furo (Evidence: [docs/conf.py:47](../../../algokit-subscriber-py/docs/conf.py#L47))
- **Extensions** (Sphinx):
  - sphinx.ext.githubpages (Evidence: [docs/conf.py:18](../../../algokit-subscriber-py/docs/conf.py#L18))
  - sphinx.ext.intersphinx (Evidence: [docs/conf.py:19](../../../algokit-subscriber-py/docs/conf.py#L19))
  - sphinx_copybutton (Evidence: [docs/conf.py:20](../../../algokit-subscriber-py/docs/conf.py#L20))
  - myst_parser (Evidence: [docs/conf.py:21](../../../algokit-subscriber-py/docs/conf.py#L21))
  - autodoc2 (Evidence: [docs/conf.py:22](../../../algokit-subscriber-py/docs/conf.py#L22))
  - sphinx.ext.doctest (Evidence: [docs/conf.py:23](../../../algokit-subscriber-py/docs/conf.py#L23))
  - sphinxmermaid (Evidence: [docs/conf.py:24](../../../algokit-subscriber-py/docs/conf.py#L24))
- **API Documentation**: autodoc2 configured to auto-generate from `../src/algokit_subscriber` (Evidence: [docs/conf.py:59-64](../../../algokit-subscriber-py/docs/conf.py#L59-L64))
- **Build Commands**: poethepoet tasks in [pyproject.toml:134-138](../../../algokit-subscriber-py/pyproject.toml#L134-L138)
  - `docs-test`: Run doctests
  - `docs-clear`: Clean build directory
  - `docs-build`: Full documentation build
  - `docs-dev`: Build and serve with auto-rebuild

### 6.3 Publishing Automation
- **Hosting**: GitHub Pages
- **Workflow**: [.github/workflows/gh-pages.yaml](../../../algokit-subscriber-py/.github/workflows/gh-pages.yaml)
- **Triggers**:
  - `workflow_call` - called from cd.yaml after production releases (Evidence: [cd.yaml:83-92](../../../algokit-subscriber-py/.github/workflows/cd.yaml#L83-L92))
  - `workflow_dispatch` - manual trigger
- **Publishing Steps**:
  1. Run doctests (Evidence: [gh-pages.yaml:30-31](../../../algokit-subscriber-py/.github/workflows/gh-pages.yaml#L30-L31))
  2. Build docs (Evidence: [gh-pages.yaml:33-34](../../../algokit-subscriber-py/.github/workflows/gh-pages.yaml#L33-L34))
  3. Upload artifact (Evidence: [gh-pages.yaml:36-39](../../../algokit-subscriber-py/.github/workflows/gh-pages.yaml#L36-L39))
  4. Deploy to GitHub Pages (Evidence: [gh-pages.yaml:41-42](../../../algokit-subscriber-py/.github/workflows/gh-pages.yaml#L41-L42))

### 6.4 Documentation Structure
- **API Docs**: Yes - auto-generated via autodoc2 from source code (Evidence: [docs/api.md](../../../algokit-subscriber-py/docs/api.md))
- **Guides/Tutorials**: Yes - comprehensive markdown documentation:
  - [docs/index.md](../../../algokit-subscriber-py/docs/index.md) - Main documentation (25,861 bytes)
  - [docs/subscriber.md](../../../algokit-subscriber-py/docs/subscriber.md) - Subscriber guide (5,495 bytes)
  - [docs/subscriptions.md](../../../algokit-subscriber-py/docs/subscriptions.md) - Subscriptions guide (19,847 bytes)
- **Examples**: Yes - [examples/](../../../algokit-subscriber-py/examples/) directory exists
- **Architecture Docs**: Documented within index.md and guides

### 6.5 Documentation Gaps
1. **Docs Only Published for Production Releases**: Beta releases don't publish documentation (Evidence: [cd.yaml:86-87](../../../algokit-subscriber-py/.github/workflows/cd.yaml#L86-L87)), potentially leaving docs out of sync with beta releases
2. **Suppressed Warnings**: Multiple warning suppressions configured (Evidence: [docs/conf.py:36-43](../../../algokit-subscriber-py/docs/conf.py#L36-L43) and [docs/conf.py:82-88](../../../algokit-subscriber-py/docs/conf.py#L82-L88)), including duplicate suppression of same warnings
3. **No ReadTheDocs Configuration**: Only GitHub Pages supported, no .readthedocs.yaml for multi-version documentation

---

## 7. Gaps, Risks, and Observations

### 7.1 Critical Gaps
1. **No Coverage Thresholds Enforced** (Evidence: [pyproject.toml](../../../algokit-subscriber-py/pyproject.toml) missing [tool.coverage.report] section, [check-python.yaml:46](../../../algokit-subscriber-py/.github/workflows/check-python.yaml#L46) missing `--cov-fail-under`)
   - Impact: Code coverage can degrade over time without breaking CI
   - Risk: Quality degradation over time

2. **All GitHub Actions Unpinned to Commit SHAs** (Evidence: All workflow files)
   - Impact: 8 action references vulnerable to tag/branch manipulation
   - Risk: **P0 Supply Chain Security Risk**, especially for PyPI publishing action
   - Affected: actions/checkout, actions/setup-python, MishaKav/pytest-coverage-comment, actions/create-github-app-token, python-semantic-release/python-semantic-release, pypa/gh-action-pypi-publish, actions/upload-pages-artifact, actions/deploy-pages

3. **No __version__ Export** (Evidence: [src/algokit_subscriber/__init__.py](../../../algokit-subscriber-py/src/algokit_subscriber/__init__.py))
   - Impact: Users cannot programmatically check installed version
   - Risk: Poor developer experience, debugging difficulties

### 7.2 Risks
1. **Dual Release Mode Complexity** (Evidence: [cd.yaml:61-74](../../../algokit-subscriber-py/.github/workflows/cd.yaml#L61-L74))
   - Impact: Manual intervention required to distinguish beta vs production releases
   - Risk: Human error in selecting wrong release type
   - Recommendation: Consider conventional branch-based beta releases or single release mode

2. **Hardcoded Python Version in Multiple Locations** (Evidence: [pyproject.toml:9](../../../algokit-subscriber-py/pyproject.toml#L9), [setup-algokit-python/action.yaml:13](../../../algokit-subscriber-py/.github/actions/setup-algokit-python/action.yaml#L13), [gh-pages.yaml:24](../../../algokit-subscriber-py/.github/workflows/gh-pages.yaml#L24))
   - Impact: Version updates require changes in 3 locations
   - Risk: Version drift between CI and project requirements
   - Recommendation: Use `.python-version` file or reference from pyproject.toml

3. **Tests Executed Twice** (Evidence: [check-python.yaml:40-46](../../../algokit-subscriber-py/.github/workflows/check-python.yaml#L40-L46) and [cd.yaml:50-54](../../../algokit-subscriber-py/.github/workflows/cd.yaml#L50-L54))
   - Impact: Increased CI time and resource usage
   - Risk: Inefficiency, slower feedback loop
   - Recommendation: Only run comprehensive tests in check-python workflow, skip in cd.yaml

4. **Single Python Version Testing** (Evidence: Only 3.12 tested despite `^3.12` requirement)
   - Impact: No validation on newer Python versions (3.13+)
   - Risk: Compatibility issues not caught in CI
   - Recommendation: Add matrix testing for supported Python versions

5. **Branch-Based Action References** (Evidence: [check-python.yaml:50](../../../algokit-subscriber-py/.github/workflows/check-python.yaml#L50) `MishaKav/pytest-coverage-comment@main`, [cd.yaml:78](../../../algokit-subscriber-py/.github/workflows/cd.yaml#L78) `pypa/gh-action-pypi-publish@release/v1`)
   - Impact: Highest supply chain risk - code can change without notice
   - Risk: **Critical** for PyPI publishing action
   - Recommendation: Pin to commit SHAs immediately

### 7.3 Standardization Opportunities
1. **Reusable Workflow for Python Libraries**: This repository's structure (check-python.yaml, cd.yaml, gh-pages.yaml) could be templatized for other Python libraries in the AlgoKit ecosystem
2. **Standard Coverage Thresholds**: Establish organization-wide coverage minimums (e.g., 80% lines, 75% branches)
3. **Standard Pre-commit Hooks**: The pre-commit configuration with black, ruff, and mypy could be standardized across Python repos
4. **Python Version Management**: Establish standard practice for Python version specification (.python-version file + reference in workflows)
5. **Action Pinning Policy**: Establish organization-wide policy to pin all actions to commit SHAs
6. **Custom Action Reuse**: The setup-algokit-python action could be extracted to a shared repository for reuse across AlgoKit Python projects

### 7.4 Unique Patterns (Non-Issues)
1. **Beta/Production Toggle via workflow_dispatch**: Unique approach to controlling release types without separate branches (Evidence: [cd.yaml:11-17](../../../algokit-subscriber-py/.github/workflows/cd.yaml#L11-L17))
   - Justification: Simplifies branching strategy while maintaining release control
   - Trade-off: Requires manual intervention but avoids branch proliferation

2. **Conditional Documentation Publishing**: Only publishes docs for production releases (Evidence: [cd.yaml:86-87](../../../algokit-subscriber-py/.github/workflows/cd.yaml#L86-L87))
   - Justification: Prevents documentation churn from beta releases
   - Trade-off: Beta release documentation not publicly available

3. **Comprehensive Sphinx Extensions**: Uses modern Sphinx stack with autodoc2, myst-parser, and mermaid support (Evidence: [docs/conf.py:17-25](../../../algokit-subscriber-py/docs/conf.py#L17-L25))
   - Justification: Rich documentation capabilities for complex library
   - Appropriate for: High-quality Python library documentation

4. **Poethepoet for Documentation Tasks**: Uses poethepoet instead of Make or tox (Evidence: [pyproject.toml:134-138](../../../algokit-subscriber-py/pyproject.toml#L134-L138))
   - Justification: Python-native task runner, better Windows compatibility than Make
   - Appropriate for: Modern Python project tooling

---

## 8. Evidence Summary
- **Total Files Analyzed**: 17
- **Key Evidence Files**:
  - [pyproject.toml](../../../algokit-subscriber-py/pyproject.toml) - Project configuration, semantic-release config, tool settings
  - [.github/workflows/check-python.yaml](../../../algokit-subscriber-py/.github/workflows/check-python.yaml) - PR validation workflow
  - [.github/workflows/cd.yaml](../../../algokit-subscriber-py/.github/workflows/cd.yaml) - Release automation workflow
  - [.github/workflows/gh-pages.yaml](../../../algokit-subscriber-py/.github/workflows/gh-pages.yaml) - Documentation publishing
  - [.github/actions/setup-algokit-python/action.yaml](../../../algokit-subscriber-py/.github/actions/setup-algokit-python/action.yaml) - Reusable composite action
  - [.pre-commit-config.yaml](../../../algokit-subscriber-py/.pre-commit-config.yaml) - Pre-commit hooks configuration
  - [docs/conf.py](../../../algokit-subscriber-py/docs/conf.py) - Sphinx documentation configuration
  - [src/algokit_subscriber/__init__.py](../../../algokit-subscriber-py/src/algokit_subscriber/__init__.py) - Package initialization and exports
  - [CHANGELOG.md](../../../algokit-subscriber-py/CHANGELOG.md) - Version history
  - [poetry.lock](../../../algokit-subscriber-py/poetry.lock) - Locked dependencies

**Analysis Completion**: All 35 steps completed following Single Repository Analysis Plan methodology.
