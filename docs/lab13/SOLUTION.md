##### Generate a `util-lib` workspace schematic:

```shell script
nx generate @nrwl/workspace:workspace-schematic util-lib
```

##### Adding an enum to a schematic that prompts when empty

```
"directory": {
      "type": "string",
      "description": "The scope of your lib.",
      "x-prompt": "Which directory do you want the lib to be in?",
      "enum": [
        "store",
        "api",
        "shared"
      ]
    }
```

##### Defaulting to TSLint


```
import { chain, externalSchematic, Rule } from '@angular-devkit/schematics';

export default function(schema: any): Rule {
  return chain([
    externalSchematic('@nrwl/workspace', 'lib', {
      name: schema.name,
      linter: 'tslint'
    })
  ]);
}
```

##### Prefixing the name

 ```
import { chain, externalSchematic, Rule } from '@angular-devkit/schematics';

export default function(schema: any): Rule {
  return chain([
    externalSchematic('@nrwl/workspace', 'lib', {
      name: `util-${schema.name}`,
      linter: 'tslint'
    })
  ]);
}
```

##### Choosing the directory

 ```
import { chain, externalSchematic, Rule } from '@angular-devkit/schematics';

export default function(schema: any): Rule {
  return chain([
    externalSchematic('@nrwl/workspace', 'lib', {
      name: `util-${schema.name}`,
      linter: 'tslint',
      directory: schema.directory
    })
  ]);
}
```

##### Passing in tags

 ```
import { chain, externalSchematic, Rule } from '@angular-devkit/schematics';

export default function(schema: any): Rule {
  return chain([
    externalSchematic('@nrwl/workspace', 'lib', {
      name: `util-${schema.name}`,
      linter: 'tslint',
      directory: schema.directory,
      tags: `type:util', scope:${schema.directory}`
    })
  ]);
}
```
