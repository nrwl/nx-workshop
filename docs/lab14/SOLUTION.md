##### Final schematic code

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

##### BONUS SOLUTION

```typescript
import { formatFiles, Tree, updateJson } from '@nrwl/devkit';
import { get } from 'lodash';

function sortKeysAtJsonPath(host: Tree, path: string, jsonPath: string[]): Rule {
  updateJson(host, path, (json) => {
    //traverse JSON to find value we want to sort
    let parent = json;
    if (jsonPath.length > 1) {
      const pathToParent = jsonPath.slice(0, jsonPath.length - 1);
      parent = get(json, pathToParent);
    }
    const unordered = get(json, jsonPath);
    //sort the keys
    const sorted = {};
    Object.keys(unordered).sort().forEach(key => {
      sorted[key] = unordered[key];
    });
    //mutate original json and return it
    const childProp = jsonPath[jsonPath.length - 1];
    parent[childProp] = sorted;
    return json;
  });
}

export default function(host: Tree) {
  sortKeysAtJsonPath(host, 'workspace.json', ['projects']),
  sortKeysAtJsonPath(host, 'nx.json', ['projects']),
  sortKeysAtJsonPath(host, 'tsconfig.base.json', ['compilerOptions', 'paths']),
  formatFiles(host),
}
```
