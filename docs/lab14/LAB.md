### 💻 Lab 14 - Workspace schematics - Modifying files

###### ⏰ Estimated time: 5-10 minutes

#### 📚 Learning outcomes:

- Understand how to bootstrap a new Nx workspace

#### 🏋️‍♀️ Steps :

1. Generate another schematic: `nx generate @nrwl/workspace:workspace-schematic sort-project-references`
2. Add this code to it:

```
import { chain, Rule } from '@angular-devkit/schematics';
import { formatFiles, updateJsonInTree } from '@nrwl/workspace';
import {get} from 'lodash';

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

3. Try to invoke it: `nx workspace-schematic sort-project-references`
    - You'll get an error that `name` is a required property. In this case, we don't need that property.
    
4. Remove the `name` property from `schema.json`:

```
{
  "$schema": "http://json-schema.org/schema",
  "id": "sort-project-references",
  "type": "object",
  "properties": {
  }
}
```

5. Invoke it: `nx workspace-schematic sort-project-references`
6. Notice the re-arranged paths

---

🎓If you get stuck, check out [the solution](SOLUTION.md)

---

[➡️ Next lab ➡️](../lab15/LAB.md)
