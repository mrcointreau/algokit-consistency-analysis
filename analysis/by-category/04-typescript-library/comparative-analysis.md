| Criteria                | algokit-utils-ts       | algokit-subscriber-ts   | algokit-utils-ts-debug  | algorand-typescript-testing    |
| ----------------------- | ---------------------- | ----------------------- | ----------------------- | ------------------------------ |
| **Monorepo**            | Yes (9 packages)       | No                      | No                      | No                             |
| **Package Manager**     | npm                    | npm                     | npm                     | npm                            |
| **Test Framework**      | vitest                 | vitest                  | Jest                    | vitest                         |
| **Coverage Thresholds** | ❌ None                 | ❌ None                  | ❌ None                  | ❌ None                         |
| **Release Tool**        | semantic-release       | semantic-release        | semantic-release        | semantic-release               |
| **Release Version**     | ^24.1.2                | ^25.0.2                 | ^25.0.2                 | ^24.2.9                        |
| **Release Config**      | Inline in package.json | Inline in package.json  | Inline in package.json  | **Separate .releaserc.json** ✅ |
| **Docs Tool**           | TypeDoc                | TypeDoc                 | TypeDoc                 | TypeDoc                        |
| **Docs Publishing**     | ❌ None (committed)     | ❌ None (committed)      | ❌ None (committed)      | **GitHub Pages** ✅             |
| **Workflow Pattern**    | Custom action          | External (makerxstudio) | External (makerxstudio) | **Own node-ci.yml** ✅          |
| **Commitlint**          | ✅ Yes                  | ✅ Yes                   | ✅ Yes                   | ✅ Yes                          |
| **Formatter**           | Prettier               | Prettier                | Prettier                | Prettier                       |
| **Dependabot**          | ✅ Yes                  | ✅ Yes                   | ✅ Yes                   | ❌ No                           |
| **Dependabot Prefix**   | ✅ chore(deps)          | ❌ None                  | ✅ chore(deps)           | ❌ N/A                          |
| **Dependabot Grouping** | ✅ Yes                  | ❌ No                    | ✅ Yes                   | ❌ N/A                          |
| **Node Version**        | 20.x                   | 22.x                    | 18.x/20.x mixed         | 22.x                           |
| **Action Pinning**      | Mostly tags            | Mostly tags             | Mostly tags             | Mostly tags                    |

### TypeScript-Specific

| Criteria | algokit-utils-ts | algokit-subscriber-ts | algokit-utils-ts-debug | algorand-typescript-testing |
|----------|------------------|----------------------|------------------------|------------------------------|
| **.nvmrc** | ❌ No | ❌ No | ❌ No | ❌ No |