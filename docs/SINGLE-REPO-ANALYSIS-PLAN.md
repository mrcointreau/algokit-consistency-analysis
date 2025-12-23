# Single Repository Analysis Plan

## Purpose

This plan enables analysis of **one AlgoKit repository at a time**. Execute this plan in a fresh context for each repository, then aggregate all reports later.

---

## Execution Instructions

When you start a new analysis session, provide this prompt:

```
Analyze the <REPO-NAME> repository following the Single Repository Analysis Plan in SINGLE-REPO-ANALYSIS-PLAN.md.

Repository to analyze: <REPO-NAME>
Working directory: /Users/lucamartini/Desktop/algokit-consistency-analysis/<REPO-NAME>
Output file: /Users/lucamartini/Desktop/algokit-consistency-analysis/reports/<REPO-NAME>-analysis.md

Follow the 35-step checklist and produce a comprehensive report following the standardized schema.
```

Replace `<REPO-NAME>` with one of these 17 repositories:

### Category 1: Python Library
- algokit-utils-py ✅ (COMPLETED)
- algokit-subscriber-py

### Category 2: Python CLI Tool
- algokit-cli
- algokit-client-generator-py

### Category 3: Python Compiler/Language Tool
- puya
- algorand-python-testing

### Category 4: TypeScript Library
- algokit-utils-ts
- algokit-utils-ts-debug
- algokit-subscriber-ts
- algorand-typescript-testing

### Category 5: TypeScript CLI Tool
- algokit-client-generator-ts
- puya-ts
- algokit-avm-debugger

### Category 6: Frontend Web Application
- algokit-lora

### Category 7: VSCode Extension
- algokit-avm-vscode-debugger

### Category 8: Serverless Backend API
- algokit-dispenser-api

### Category 9: Static Documentation Site
- algokit-example-gallery

---

## Analysis Methodology

### Step 1: Context Gathering (Steps 1-4)

**Phase 1: Repository Context**

1. ✅ Identify tech stack (Python/TypeScript/Mixed)
   - Look for: pyproject.toml (Python), package.json (TypeScript)
   - Mixed repos have both

2. ✅ Identify purpose category
   - Library: No CLI entry points, distributed via PyPI/npm
   - CLI Tool: Has bin entry points, executable commands
   - Compiler: Language transformation, LSP/DAP support
   - Extension: VSCode extension manifest
   - Service: Deployment configs (SST, Lambda, etc.)
   - Web App: React/Vite/Astro, web hosting configs
   - Testing Framework: Test utilities, framework naming

3. ✅ Identify monorepo structure
   - Python: Check for multiple pyproject.toml files in subdirectories
   - TypeScript: Check for workspaces in package.json, pnpm-workspace.yaml
   - List all packages if monorepo

4. ✅ List all relevant signal files
   - CI/CD: .github/workflows/*.{yaml,yml}
   - Release: CHANGELOG.md, .releaserc.json, release.config.ts
   - Versioning: package.json, pyproject.toml, __init__.py
   - Testing: tests/, vitest.config.ts, jest.config.ts, pytest in pyproject.toml
   - Documentation: docs/, typedoc.json, conf.py (Sphinx)
   - Branching: commitlint.config.*, .pre-commit-config.yaml

---

### Step 2: CI/CD Analysis (Steps 5-10)

**Phase 2: CI/CD Analysis**

5. ✅ Catalogue all workflow files
   - List all files in .github/workflows/
   - Note custom actions in .github/actions/

6. ✅ Extract workflow triggers
   - For each workflow, extract `on:` section
   - Note: branches, tags, schedule, workflow_dispatch, workflow_call

7. ✅ Extract third-party actions inventory
   - Search for `uses:` in all workflows
   - Record: action name, version/ref, which workflow uses it
   - **SECURITY CHECK**: Flag if pinned to tag (v4) vs commit SHA
   - **SECURITY CHECK**: Flag if pinned to branch (main) instead of immutable ref

8. ✅ Extract runtime version sources
   - **Python**: Find setup-python version, check for .python-version, pyproject.toml requires-python
   - **TypeScript**: Find setup-node version, check for .nvmrc, package.json engines
   - Determine source of truth: hardcoded vs matrix vs file-based

9. ✅ Identify release automation
   - **Python**: Look for python-semantic-release, manual PyPI publish steps
   - **TypeScript**: Look for semantic-release, changesets, manual npm publish
   - Check for automated tagging, changelog generation

10. ✅ Note CI/CD gaps or anomalies
    - Missing workflows (no CI, no release automation)
    - Inconsistent action versions across workflows
    - Security issues (unpinned actions, secrets exposure)
    - Complex/fragile release logic

---

### Step 3: Branching Strategy Analysis (Steps 11-15)

**Phase 3: Branching Strategy Analysis**

11. ✅ Extract branch triggers from all workflows
    - Which branches trigger PR validation
    - Which branches trigger releases
    - Which branches have special purposes (alpha, beta, staging, production)

12. ✅ Identify commit convention enforcement
    - **Commitlint**: Look for commitlint.config.{cjs,ts,js}
    - **Pre-commit hooks**: Look for .pre-commit-config.yaml
    - List all hooks configured

13. ✅ Identify release branch strategy
    - **semantic-release**: Check .releaserc.json or pyproject.toml [tool.semantic_release]
    - Look for `branches` configuration
    - Note: main-only, main+beta, main+beta+alpha, etc.

14. ✅ Identify trunk-based compliance
    - **Fully compliant**: main branch only, no long-lived branches
    - **Partially compliant**: main + prerelease branches (alpha/beta)
    - **Non-compliant**: git-flow pattern with develop, release/*, hotfix/*

15. ✅ Note environment-specific branches
    - Deployment branches: preview, staging, production
    - Feature flag branches
    - Infrastructure branches

---

### Step 4: Release & Versioning Analysis (Steps 16-21)

**Phase 4: Release & Versioning Analysis**

16. ✅ Identify release mechanism
    - **Python**: python-semantic-release vs manual
    - **TypeScript**: semantic-release, changesets, or manual
    - **Hybrid**: automated tagging but manual publish

17. ✅ Extract tag format
    - From semantic-release config or workflow
    - Format: v1.2.3, 1.2.3, @scope/package@1.2.3
    - Consistency across repos

18. ✅ Extract version sources
    - **Python**: pyproject.toml version field, __init__.py __version__
    - **TypeScript**: package.json version field
    - **Multiple sources**: Check for sync issues

19. ✅ Identify version propagation strategy
    - Auto-commit by semantic-release
    - Manual version bumps
    - Lockfile update strategy (committed vs gitignored)

20. ✅ For monorepos: map version sources per package
    - List all package.json or pyproject.toml files
    - Note version synchronization strategy:
      - All packages same version
      - Independent versions (lerna independent mode)
      - Mixed strategy

21. ✅ Note versioning gaps or inconsistencies
    - Stale versions in docs
    - Missing __version__ exports
    - Version mismatches between sources

---

### Step 5: Testing Analysis (Steps 22-26)

**Phase 5: Testing Analysis**

22. ✅ Identify test framework
    - **Python**: pytest (check pyproject.toml [tool.pytest])
    - **TypeScript**: vitest, jest (check vitest.config.ts, jest.config.ts)

23. ✅ Extract coverage configuration
    - **Tool**: pytest-cov, c8, nyc, coverage.py
    - **Thresholds**: Look for coverage thresholds (lines, branches, functions, statements)
    - **Reporting**: lcov, html, terminal, PR comments

24. ✅ Identify test structure
    - **Separation**: unit, integration, e2e directories
    - **File patterns**: test_*.py, *.test.ts, *.spec.ts
    - **Special categories**: Mock server tests, contract tests, polytest

25. ✅ Verify CI enforcement
    - **Test execution**: Which workflow runs tests
    - **Coverage enforcement**: Is --cov-fail-under used? Threshold enforced?
    - **Matrix testing**: Multiple Python/Node versions

26. ✅ Note testing gaps
    - No tests directory
    - No coverage configuration
    - No CI enforcement
    - Low/missing coverage thresholds

---

### Step 6: Documentation Analysis (Steps 27-31)

**Phase 6: Documentation Analysis**

27. ✅ Identify documentation tooling
    - **Python**: Sphinx (check docs/conf.py, docs/source/conf.py)
    - **TypeScript**: TypeDoc (check typedoc.json)
    - **Manual**: Plain markdown in docs/

28. ✅ Extract generation settings
    - **Sphinx**: Theme (furo, alabaster), extensions (autodoc, napoleon, autoapi)
    - **TypeDoc**: entryPoints, out directory, theme
    - **Build commands**: In pyproject.toml tasks or package.json scripts

29. ✅ Identify publishing automation
    - **GitHub Pages**: Look for gh-pages workflow, deployment steps
    - **ReadTheDocs**: Look for .readthedocs.yaml
    - **Netlify**: Look for netlify.toml
    - **Manual**: No automation found

30. ✅ Assess documentation structure
    - **API Docs**: Auto-generated from docstrings/types
    - **Guides/Tutorials**: Markdown guides in docs/
    - **Examples**: Code examples, sample projects
    - **Architecture Docs**: ARCHITECTURE.md, design docs

31. ✅ Note documentation gaps
    - No documentation automation
    - Incomplete API docs
    - Outdated guides
    - Stale version numbers in docs

---

### Step 7: Synthesis & Observations (Steps 32-35)

**Phase 7: Synthesis & Observations**

32. ✅ Summarize alignment with expected patterns
    - Compare to expected patterns for this category (from REPO-CATEGORIZATION-LOGIC.md)
    - Libraries should have: semantic versioning, automated releases, comprehensive tests
    - CLI tools should have: binary builds, cross-platform support
    - Web apps should have: preview deployments, build optimization

33. ✅ Identify risks
    - **Security**: Unpinned GitHub Actions, exposed secrets
    - **Reliability**: Missing test coverage, no CI enforcement
    - **Maintainability**: Complex release logic, inconsistent versioning

34. ✅ Note opportunities for standardization
    - Reusable workflows that could be shared
    - Configuration templates (.releaserc, coverage config)
    - Tooling consolidation (pytest vs unittest, vitest vs jest)

35. ✅ Flag unique patterns (non-issues)
    - Legitimate deviations from standard patterns
    - Repo-specific requirements (e.g., compiler test cases)
    - Appropriate complexity (e.g., multi-stage releases)

---

## Report Schema

Save the analysis to: `reports/<REPO-NAME>-analysis.md`

Use this exact structure:

```markdown
# Repository Analysis: <REPO-NAME>

## 1. Repository Overview
- **Tech Stack**: {Python|TypeScript|Mixed}
- **Purpose Category**: {Category from REPO-CATEGORIZATION-LOGIC.md}
- **Monorepo**: {Yes|No} (if Yes, list packages)
- **Signal Files**: List all key files identified

---

## 2. CI/CD Findings

### 2.1 Workflow Inventory
| Workflow File | Purpose | Triggers |
|---------------|---------|----------|
| {filename} | {PR validation|CD|Release|Docs|Cron} | {branches/tags/schedule} |

### 2.2 Third-Party Actions
| Action | Version | Used In | Pinned |
|--------|---------|---------|--------|
| {org/action} | {v4|commit-sha|tag} | {workflow name} | {Yes|No} |

**SECURITY FINDINGS**:
- List all unpinned actions (tag-based or branch-based refs)
- Flag as HIGH PRIORITY supply chain security risk

### 2.3 Runtime Versions
- **Node Version**: {version} (Source: {hardcoded|matrix|.nvmrc|package.json})
- **Python Version**: {version} (Source: {hardcoded|matrix|pyproject.toml})

### 2.4 Release Automation
- **Mechanism**: {semantic-release|manual|GitHub Actions auto-release}
- **Triggers**: {on tag push|on release creation|manual workflow_dispatch}

### 2.5 CI/CD Gaps & Anomalies
- {List any issues: outdated actions, missing automation, security concerns}

---

## 3. Branching Strategy Findings

### 3.1 Branch Triggers
| Workflow | Branches | Tags | Purpose |
|----------|----------|------|---------|
| {workflow name} | {main, release/*} | {v*} | {when this workflow runs} |

### 3.2 Commit Conventions
- **Commitlint**: {Yes|No} (Config: {conventional|custom})
- **Pre-commit Hooks**: {Yes|No} (Hooks: {list})

### 3.3 Release Branch Strategy
- **Semantic-Release Branches**: {[main]|[main, beta, alpha]|N/A}
- **Environment Branches**: {preview, staging, production|None}

### 3.4 Trunk-Based Compliance
- **Assessment**: {Fully compliant|Partially compliant|Non-compliant}
- **Evidence**: {main-only releases|multiple release branches|git-flow pattern}

---

## 4. Release & Versioning Findings

### 4.1 Release Mechanism
- **Tool**: {semantic-release|manual|hybrid}
- **Config File**: {.releaserc.json|release.config.ts|N/A}
- **Automation Level**: {Fully automated|Semi-automated|Manual}

### 4.2 Tag Format
- **Format**: {v1.2.3|1.2.3|@package/name@1.2.3}
- **Source**: {semantic-release config|workflow hardcoded|manual}

### 4.3 Version Sources
| File | Field | Current Value | Role |
|------|-------|---------------|------|
| {package.json} | {version} | {1.2.3} | {Source of truth|Synced from|Not used} |

### 4.4 Version Propagation
- **Auto-commit**: {Yes|No} (By: {semantic-release|workflow|manual})
- **Lockfile Updates**: {Automatic|Manual|N/A}

### 4.5 Monorepo Version Strategy (if applicable)
- **Synchronization**: {All packages same version|Independent versions}
- **Tool**: {pnpm workspace|npm workspaces|lerna|independent}

---

## 5. Testing Strategy Findings

### 5.1 Test Framework
- **Framework**: {vitest|jest|pytest}
- **Config File**: {vitest.config.ts|jest.config.ts|pytest in pyproject.toml}

### 5.2 Coverage Configuration
- **Tool**: {c8|nyc|coverage.py}
- **Thresholds**: {lines: X%, branches: Y%, functions: Z%, statements: W%}
- **Reporting**: {lcov|html|terminal|none}

### 5.3 Test Structure
- **Separation**: {Unit|Integration|E2E|All mixed}
- **File Patterns**: {*.test.ts|test_*.py|etc.}

### 5.4 CI Enforcement
- **Test Execution**: {Yes|No} (In workflow: {workflow name})
- **Coverage Enforcement**: {Yes|No} (Threshold enforced: {Yes|No})

### 5.5 Testing Gaps
- {List: no tests, no coverage, no CI enforcement, low coverage thresholds}

---

## 6. Documentation Findings

### 6.1 Documentation Tooling
- **Tool**: {Sphinx|TypeDoc|Manual markdown|None}
- **Config File**: {docs/conf.py|typedoc.json|N/A}

### 6.2 Generation Settings
- **Theme**: {furo|alabaster|default|N/A}
- **Extensions** (Sphinx): {autodoc, napoleon, etc.|N/A}
- **Entry Points** (TypeDoc): {src/index.ts|packages/*/src|N/A}

### 6.3 Publishing Automation
- **Hosting**: {GitHub Pages|Netlify|ReadTheDocs|None}
- **Workflow**: {gh-pages.yaml|release.yaml|None}
- **Triggers**: {on release|on push to main|manual}

### 6.4 Documentation Structure
- **API Docs**: {Yes|No}
- **Guides/Tutorials**: {Yes|No}
- **Examples**: {Yes|No}
- **Architecture Docs**: {Yes|No}

### 6.5 Documentation Gaps
- {List: no automation, incomplete API docs, outdated guides}

---

## 7. Gaps, Risks, and Observations

### 7.1 Critical Gaps
1. {Gap description with evidence file reference}

### 7.2 Risks
1. {Risk description with impact assessment}

### 7.3 Standardization Opportunities
1. {Opportunity description with potential benefit}

### 7.4 Unique Patterns (Non-Issues)
1. {Unique but valid pattern specific to this repo's purpose}

---

## 8. Evidence Summary
- **Total Files Analyzed**: {count}
- **Key Evidence Files**:
  - {file:line} (for {fact})
  - {file:line} (for {fact})
```

---

## Evidence Citation Rules

**CRITICAL**: Every claim must cite evidence using markdown links:

✅ **Good**: "Workflow uses setup-node v4 (Evidence: [.github/workflows/pr.yaml:15](.github/workflows/pr.yaml#L15))"

❌ **Bad**: "Workflow uses setup-node"

**Link Format**:
- For file-level facts: `(Evidence: filename)`
- For line-specific facts: `(Evidence: [filename:line](filename#Lline))`
- For multi-file facts: `(Evidence: file1, file2, file3)`

---

## Analysis Constraints

1. **No Prescriptive Standards**: This is analysis-only. Flag inconsistencies and risks, but don't mandate specific solutions.

2. **Evidence-Based Only**: Every claim must cite file evidence. No assumptions.

3. **Cohort-Aware**: Don't penalize repos for ecosystem-appropriate choices (pytest vs vitest, npm vs poetry).

4. **Security Focus**: Treat unpinned GitHub Actions as **P0 high-impact security risks**.

5. **Comprehensive Extraction**: Request full file contents when needed for accuracy. Don't compromise on detail.

---

## Key Files to Check by Category

### Python Library
- pyproject.toml (version, dependencies, tool configs)
- src/{package}/__init__.py (version export)
- tests/ (pytest tests)
- docs/source/conf.py (Sphinx config)
- .github/workflows/ (CI/CD)

### TypeScript Library
- package.json (version, dependencies, scripts)
- src/index.ts (exports)
- tests/ or test/ (vitest/jest tests)
- typedoc.json (TypeDoc config)
- .github/workflows/ (CI/CD)

### CLI Tool (Python)
- pyproject.toml [project.scripts] (CLI entry points)
- Binary build workflows (build-binaries.yaml)
- Cross-platform installers

### CLI Tool (TypeScript)
- package.json bin field (CLI entry points)
- Build/bundle config (rollup, esbuild)
- shebang in CLI files

### Web Application
- vite.config.ts or next.config.js
- netlify.toml or vercel.json
- Environment-specific workflows (preview, production)

### VSCode Extension
- package.json activationEvents, contributes
- .vsix packaging workflow
- VSCode marketplace publishing

---

## Success Criteria

For each repository analysis:

✅ **Complete 35-step checklist**
✅ **Follow exact report schema**
✅ **Cite evidence for all claims**
✅ **Flag all security risks (unpinned actions)**
✅ **Assess trunk-based compliance**
✅ **Identify gaps, risks, and opportunities**
✅ **Save report to reports/{repo-name}-analysis.md**

---

## After All 17 Analyses Complete

Once all repository reports exist in `reports/`, run the aggregation analysis:

```
Aggregate all 17 repository analyses following the Cross-Repo Aggregation Plan.

Input: All reports in reports/*-analysis.md
Output: reports/cross-repo-aggregation.md and reports/executive-summary.md

Use the aggregation strategy from SINGLE-REPO-ANALYSIS-PLAN.md Section "Cross-Repo Aggregation".
```

---

## Cross-Repo Aggregation (Run After All 17 Reports Complete)

### Aggregation Steps

1. **Load all 17 reports** from reports/*-analysis.md

2. **Build cohort classifications**:
   - Group by tech stack: Python (6), TypeScript (10), Mixed (1)
   - Group by category: 9 categories from REPO-CATEGORIZATION-LOGIC.md

3. **Build inconsistency maps** for each dimension:
   - CI/CD: Workflow naming, action versions, runtime version sources
   - Branching: Commit conventions, release branches, trunk-based compliance
   - Release: Mechanisms (semantic-release vs manual), tag formats
   - Versioning: Version sources, monorepo strategies
   - Testing: Frameworks, coverage thresholds, CI enforcement
   - Documentation: Tooling (Sphinx vs TypeDoc), publishing automation

4. **Build risk assessment**:
   - High-impact risks: Unpinned actions (security), no coverage enforcement (reliability), non-trunk-based (compliance)
   - Medium-impact risks: Manual releases, inconsistent workflows
   - Low-impact risks: Inconsistent naming, aesthetic issues
   - Prevalence: Count how many repos affected

5. **Identify patterns**:
   - Positive patterns: semantic-release adoption, comprehensive testing
   - Anti-patterns: hardcoded versions, missing automation

6. **Identify standardization opportunities**:
   - Reusable workflow candidates (PR validation, release, docs)
   - Configuration templates (.releaserc, coverage thresholds)

### Aggregation Report Structure

**File**: `reports/cross-repo-aggregation.md`

```markdown
# AlgoKit Cross-Repository Analysis

## 1. Executive Summary
- Total repositories: 17
- Analysis date: {date}
- Overall consistency rating: {High|Medium|Low}

**Top 3 Critical Security/Reliability Risks**:
1. {Risk with prevalence count}
2. {Risk with prevalence count}
3. {Risk with prevalence count}

**Top 3 Standardization Opportunities**:
1. {Opportunity with impact}
2. {Opportunity with impact}
3. {Opportunity with impact}

## 2. Critical Risk Assessment

### 2.1 Security Risks (P0)
| Risk | Impact | Prevalence | Evidence |
|------|--------|------------|----------|
| Unpinned GitHub Actions | Supply chain compromise | X/17 repos | {repos list} |

### 2.2 Reliability Risks
| Risk | Impact | Prevalence | Evidence |
|------|--------|------------|----------|
| No coverage enforcement | Quality degradation | X/17 repos | {repos list} |

### 2.3 Compliance Risks
| Risk | Impact | Prevalence | Evidence |
|------|--------|------------|----------|
| Non-trunk-based branching | Complex workflows | X/17 repos | {repos list} |

## 3. Repository Cohorts

### 3.1 By Tech Stack
| Cohort | Count | Repos |
|--------|-------|-------|
| Python | 6 | {list} |
| TypeScript | 10 | {list} |
| Mixed | 1 | {list} |

### 3.2 By Category
| Category | Count | Repos |
|----------|-------|-------|
| Python Library | 2 | {list} |
| ... | ... | ... |

## 4. Cross-Repo Inconsistencies

### 4.1 CI/CD Inconsistencies
| Dimension | Variants Found | Prevalence | Standardization Potential |
|-----------|----------------|------------|---------------------------|
| Workflow naming | pr.yaml vs pr.yml vs check-python.yaml | {counts} | High |
| Action versions | setup-node v3, v4; setup-python v4, v5 | {counts} | High |

### 4.2 Branching Inconsistencies
{Similar table}

### 4.3 Release Inconsistencies
{Similar table}

### 4.4 Testing Inconsistencies
{Similar table}

### 4.5 Documentation Inconsistencies
{Similar table}

## 5. Trunk-Based Branching Compliance

### 5.1 Compliance Breakdown
| Compliance Level | Count | Repos |
|------------------|-------|-------|
| Fully compliant | X | {list} |
| Partially compliant | X | {list} |
| Non-compliant | X | {list} |

### 5.2 Compliance Analysis
{Detailed analysis of patterns}

## 6. Pattern & Anti-Pattern Analysis

### 6.1 Positive Patterns
1. **Semantic-release adoption**: X/17 repos use automated releases
2. **Comprehensive testing**: X/17 repos have test coverage
{More patterns}

### 6.2 Anti-Patterns
1. **Hardcoded runtime versions**: X/17 repos hardcode instead of using version files
2. **Missing coverage thresholds**: X/17 repos collect coverage but don't enforce
{More anti-patterns}

## 7. Standardization Opportunities

### 7.1 Reusable Workflow Candidates
1. **PR Validation (Python)**: Standard steps across X repos
2. **PR Validation (TypeScript)**: Standard steps across X repos
3. **Semantic-Release**: Could standardize across X repos
{More opportunities}

### 7.2 Configuration Template Candidates
1. **.releaserc.json**: Standardize semantic-release config
2. **Coverage thresholds**: Standardize at 80% lines, 75% branches
{More templates}

## 8. Per-Cohort Deep Dives

### 8.1 Python Repos
{Analysis}

### 8.2 TypeScript Repos
{Analysis}

### 8.3 Libraries vs Services vs Tools
{Comparison}

## 9. Appendices

### 9.1 All Repository Reports
- [algokit-utils-py](algokit-utils-py-analysis.md)
- {List all 17}

### 9.2 Evidence File Index
{Comprehensive list of all files analyzed}

### 9.3 Glossary
{Terms used in analysis}
```

---

## Repository Analysis Order (Recommended)

Analyze in this order to maximize learning across similar repos:

1. algokit-utils-py
2. algokit-subscriber-py
3. algokit-utils-ts (TypeScript equivalent of #1)
4. algokit-subscriber-ts (TypeScript equivalent of #2)
5. algokit-cli (CLI tool with binary builds)
6. algokit-client-generator-py (CLI tool, simpler)
7. puya (complex compiler with LSP)
8. algorand-python-testing (testing framework)
9. algokit-utils-ts-debug (smaller TypeScript library)
10. algorand-typescript-testing (TypeScript testing framework)
11. algokit-client-generator-ts (mixed repo, interesting case)
12. puya-ts (TypeScript compiler)
13. algokit-avm-debugger (DAP implementation)
14. algokit-avm-vscode-debugger (VSCode extension)
15. algokit-lora (web app with preview deployments)
16. algokit-dispenser-api (serverless backend)
17. algokit-example-gallery (static site, likely minimal CI)

---

This plan is complete and ready for execution. Start each new session with the repository name and follow the 35 steps.
