##### Final schematic code

```typescript
import { chain, Rule } from '@angular-devkit/schematics';
import { updateJsonInTree, formatFiles } from '@nrwl/workspace';

function sortKeys(file: string): Rule {
  return updateJsonInTree(file, (json) => {
    json.projects = sortObjectKeys(json.projects);
    return json;
  });
}

function sortObjectKeys(obj: any) {
  const sorted = {};
  Object.keys(obj).sort().forEach(key => {
    sorted[key] = obj[key];
  });
  return sorted;
}

export default function (): Rule {
  return chain([
    sortKeys('workspace.json'),
    sortKeys('nx.json'),
    formatFiles()
  ]);
}

```

##### BONUS SOLUTION

```typescript
import { chain, Rule } from '@angular-devkit/schematics';
import { formatFiles, updateJsonInTree } from '@nrwl/workspace';
import { get } from 'lodash';

function sortKeysAtJsonPath(path: string, jsonPath: string[]): Rule {
  return updateJsonInTree(path, (json) => {
    //traverse JSON to find value we want to sort
    let parent = json;
    if(jsonPath.length > 1) {
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

export default function (): Rule {
  return chain([
    sortKeysAtJsonPath('workspace.json', ['projects']),
    sortKeysAtJsonPath('nx.json', ['projects']),
    sortKeysAtJsonPath('tsconfig.base.json', ['compilerOptions', 'paths']),
    formatFiles(),
  ]);
}
```
