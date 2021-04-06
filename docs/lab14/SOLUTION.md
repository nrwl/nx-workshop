##### Change default project

```typescript
import { Tree, formatFiles, installPackagesTask } from '@nrwl/devkit';
import { updateJson } from '@nrwl/devkit';

export default async function (host: Tree) {
  await updateJson(host, 'workspace.json', (workspaceJson) => {
    workspaceJson.defaultProject = 'api';
    return workspaceJson;
  });
  await formatFiles(host);
  return () => {
    installPackagesTask(host);
  };
}
```

##### Sort workspace.json projects

```typescript
import { Tree, formatFiles, installPackagesTask } from '@nrwl/devkit';
import { updateJson } from '@nrwl/devkit';

export default async function (host: Tree) {
  await updateJson(host, 'workspace.json', (workspaceJson) => {
    workspaceJson.projects = sortObjectKeys(workspaceJson.projects);
    return workspaceJson;
  });
  await formatFiles(host);
  return () => {
    installPackagesTask(host);
  };
}

function sortObjectKeys(obj: any) {
  const sorted = {};
  Object.keys(obj)
    .sort()
    .forEach((key) => {
      sorted[key] = obj[key];
    });
  return sorted;
}

```

##### Final generator code

```typescript
import { formatFiles, Tree, updateJson } from '@nrwl/devkit';

function sortKeys(host: Tree, file: string) {
  updateJson(host, file, (json) => {
    json.projects = sortObjectKeys(json.projects);
    return json;
  });
}

function sortObjectKeys(obj: any) {
  const sorted = {};
  Object.keys(obj)
    .sort()
    .forEach((key) => {
      sorted[key] = obj[key];
    });
  return sorted;
}

export default async function(host: Tree) {
  sortKeys(host, 'workspace.json');
  sortKeys(host, 'nx.json');
  await formatFiles(host);
}
```

##### BONUS 1 SOLUTION

```typescript
function sortTsConfigPaths(host: Tree) {
  updateJson(host, 'tsconfig.base.json', (json) => {
    json.compilerOptions.paths = sortObjectKeys(json.compilerOptions.paths);
    return json;
  });
}
```

##### BONUS 2 SOLUTION

```typescript
function sortJest(host: Tree) {
  const jestConfig = 'jest.config.js';
  const contents = require(join(process.cwd(), jestConfig));
  contents.projects.sort();
  host.write(
    jestConfig,
    `
        module.exports = ${JSON.stringify(contents)};
      `
  );
}
```
