##### Generate a `internal-plugin` plugin:

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
import { libraryGenerator } from '@nrwl/workspace/generators';
import { UtilLibGeneratorSchema } from './schema';

export default async function (tree: Tree, schema: UtilLibGeneratorSchema) {
  await libraryGenerator(tree, {
    name: `util-${schema.name}`,
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
import { libraryGenerator } from '@nrwl/workspace/generators';
import { UtilLibGeneratorSchema } from './schema';

export default async function (tree: Tree, schema: UtilLibGeneratorSchema) {
  await libraryGenerator(tree, {
    name: `util-${schema.name}`,
    directory: schema.directory,
    tags: `type:util, scope:${schema.directory}`,
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

##### BONUS: Testing

```typescript
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree, readProjectConfiguration } from '@nrwl/devkit';

import generator from './generator';
import { UtilLibGeneratorSchema } from './schema';

describe('util-lib generator', () => {
  let appTree: Tree;
  const options: UtilLibGeneratorSchema = { name: 'foo', directory: 'store' };

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
  });

  it('should add util to the name and add appropriate tags', async () => {
    await generator(appTree, options);
    const config = readProjectConfiguration(appTree, 'store-util-foo');
    expect(config).toBeDefined();
    expect(config.tags).toEqual(['type:util', 'scope:store']);
  });
});
```
