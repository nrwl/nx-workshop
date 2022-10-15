##### Generate a `board-game-hoard` plugin:

```shell script
nx generate @nrwl/nx-plugin:plugin internal-plugin --minimal
```

#### Generate a `util-lib` generator:

```shell
nx generate @nrwl/nx-plugin:generator util-lib --project=internal-plugin
```

##### Running the generator in dry mode

```shell
nx generate @bg-hoard/internal-plugin:util-lib test --dry-run
```

##### Prefixing the name

```ts
import { formatFiles, installPackagesTask, Tree } from '@nrwl/devkit';
import nrwlJsLibraryGenerator from '@nrwl/workspace/src/generators/library/library';
import { UtilLibGeneratorSchema } from './schema';

export default async function (tree: Tree, options: UtilLibGeneratorSchema) {
  await nrwlJsLibraryGenerator(tree, {
    ...options,
    name: `util-${options.name}`,
  });
  await formatFiles(tree);
  return () => {
    installPackagesTask(tree);
  };
}
```

##### Adding an enum to a generator that prompts when empty

```json
{
  "directory": {
    "type": "string",
    "description": "The scope of your lib.",
    "x-prompt": {
      "message": "Which directory do you want the lib to be in?",
      "type": "list",
      "items": [
        {
          "value": "store",
          "label": "store"
        },
        {
          "value": "api",
          "label": "api"
        },
        {
          "value": "shared",
          "label": "shared"
        }
      ]
    }
  }
}
```

##### Passing in tags

```ts
import { formatFiles, installPackagesTask, Tree } from '@nrwl/devkit';
import nrwlJsLibraryGenerator from '@nrwl/workspace/src/generators/library/library';
import { UtilLibGeneratorSchema } from './schema';

export default async function (tree: Tree, options: UtilLibGeneratorSchema) {
  await nrwlJsLibraryGenerator(tree, {
    ...options,
    name: `util-${options.name}`,
    tags: `type:util, scope:${options.directory}`,
  });
  await formatFiles(tree);
  return () => {
    installPackagesTask(tree);
  };
}
```

##### Typed Schema

```typescript
export interface UtilLibGeneratorSchema {
  name: string;
  directory: 'store' | 'api' | 'shared';
}
```
