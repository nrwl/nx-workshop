##### Generate a `util-lib` workspace generator:

```shell script
nx generate @nrwl/workspace:workspace-generator util-lib
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
          "label": "Store"
        },
        {
          "value": "api",
          "label": "Api"
        },
        {
          "value": "shared",
          "label": "Shared"
        }
      ]
    },
    "enum": [
      "store",
      "api",
      "shared"
    ]
  }
}
```

##### Defaulting to TSLint


```ts
import { Tree, formatFiles, installPackagesTask } from '@nrwl/devkit';
import { libraryGenerator } from '@nrwl/workspace/generators';

export default async function(host: Tree, schema: any) {
  await libraryGenerator(host, {
    name: schema.name,
    linter: 'tslint'
  });
  await formatFiles(host);
  return () => {
    installPackagesTask(host);
  };
}
```

##### Prefixing the name

```ts
import { Tree, formatFiles, installPackagesTask } from '@nrwl/devkit';
import { libraryGenerator } from '@nrwl/workspace/generators';

export default async function(host: Tree, schema: any) {
  await libraryGenerator(host, {
    name: `util-${schema.name}`,
    linter: 'tslint'
  });
  await formatFiles(host);
  return () => {
    installPackagesTask(host);
  };
}
```

##### Choosing the directory

```ts
import { Tree, formatFiles, installPackagesTask } from '@nrwl/devkit';
import { libraryGenerator } from '@nrwl/workspace/generators';

export default async function(host: Tree, schema: any) {
  await libraryGenerator(host, {
    name: `util-${schema.name}`,
    linter: 'tslint',
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
    linter: 'tslint',
    directory: schema.directory,
    tags: `type:util', scope:${schema.directory}`
  });
  await formatFiles(host);
  return () => {
    installPackagesTask(host);
  };
}
```
