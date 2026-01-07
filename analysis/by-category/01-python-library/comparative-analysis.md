| Criteria                | algokit-subscriber-py   | algokit-utils-py          |
| ----------------------- | ----------------------- | ------------------------- |
| **Monorepo**            | No                      | No                        |
| **Package Manager**     | Poetry                  | **uv**                    |
| **Test Framework**      | pytest                  | pytest                    |
| **Coverage Thresholds** | ❌ None                  | ❌ None                    |
| **Release Tool**        | python-semantic-release | python-semantic-release   |
| **Release Version**     | v10.3.1                 | **v7.34.3** ⚠️            |
| **Release Config**      | pyproject.toml          | pyproject.toml            |
| **Docs Tool**           | Sphinx + Furo           | Sphinx + Furo             |
| **Docs Publishing**     | ✅ GitHub Pages          | ❌ None                    |
| **Workflow Pattern**    | Custom composite action | Reusable workflows        |
| **Pre-commit**          | ✅ Yes                   | ✅ Yes                     |
| **Formatter**           | black                   | ruff format               |
| **Dependabot**          | ✅ Yes                   | ✅ Yes                     |
| **Dependabot Prefix**   | ❌ None                  | ✅ chore(deps)             |
| **Dependabot Grouping** | ❌ No                    | ✅ Yes                     |
| **Python Version**      | 3.12 only               | 3.10, 3.11, 3.12 (matrix) |
| **Action Pinning**      | Tags/branches           | Tags/branches             |

### Python-Specific

| Criteria | algokit-subscriber-py | algokit-utils-py |
|----------|----------------------|------------------|
| **PyPI Auth** | ✅ Trusted (OIDC) | ❌ API Key |
| **Polytest** | ❌ No | ✅ Yes |
| **Alpha Branch** | ❌ No | ✅ Yes |
