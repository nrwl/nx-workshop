##### Generate a `util-lib` workspace generator:

```shell script
nx generate @nrwl/workspace:workspace-generator util-lib
```

##### Running the generator in dry mode

```shell
nx workspace-generator util-lib test --dry-run
```

##### Prefixing the name

```ts
import { Tree, formatFiles, installPackagesTask } from '@nrwl/devkit';
import { libraryGenerator } from '@nrwl/workspace/generators';

export default async function(host: Tree, schema: any) {
  await libraryGenerator(host, {
    name: `util-${schema.name}`,
  });
  await formatFiles(host);
  return () => {
    installPackagesTask(host);
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

##### Choosing the directory

```ts
import { Tree, formatFiles, installPackagesTask } from '@nrwl/devkit';
import { libraryGenerator } from '@nrwl/workspace/generators';

export default async function(host: Tree, schema: any) {
  await libraryGenerator(host, {
    name: `util-${schema.name}`,
    directory: schema.directory
  });
  await formatFiles(host);
  return () => {
    installPackagesTask(host);
  };
}
```

##### Passing in tags

```ts
import { Tree, formatFiles, installPackagesTask } from '@nrwl/devkit';
import { libraryGenerator } from '@nrwl/workspace/generators';

export default async function(host: Tree, schema: any) {
  await libraryGenerator(host, {
    name: `util-${schema.name}`,
    directory: schema.directory,
    tags: `type:util, scope:${schema.directory}`
  });
  await formatFiles(host);
  return () => {
    installPackagesTask(host);
  };
}
```

##### Typed Schema

```typescript
interface Schema {
  name: string;
  directory: 'store' | 'api' | 'shared';
}
```
