##### Generate a `update-scope-schema` workspace generator:

```shell script
nx generate @nrwl/nx-plugin:generator update-scope-schema --project=internal-plugin
```

##### Change default project

```typescript
import { formatFiles, Tree, updateJson } from '@nrwl/devkit';

export default async function (tree: Tree) {
  updateJson(tree, 'nx.json', (json) => ({
    ...json,
    defaultProject: 'api',
  }));
  await formatFiles(tree);
}
```

##### Adding New Scope Tags

```typescript
import {
  Tree,
  updateJson,
  formatFiles,
  ProjectConfiguration,
  getProjects,
} from '@nrwl/devkit';

function getScopes(projectMap: Map<string, ProjectConfiguration>) {
  const projects: any[] = Array.from(projectMap.values());
  const allScopes: string[] = projects
    .map((project) =>
      project.tags.filter((tag: string) => tag.startsWith('scope:'))
    )
    .reduce((acc, tags) => [...acc, ...tags], [])
    .map((scope: string) => scope.slice(6));
  return Array.from(new Set(allScopes));
}

export default async function (tree: Tree) {
  const scopes = getScopes(getProjects(tree));
  updateJson(
    tree,
    'libs/internal-plugin/src/generators/util-lib/schema.json',
    (schemaJson) => {
      schemaJson.properties.directory['x-prompt'].items = scopes.map(
        (scope) => ({
          value: scope,
          label: scope,
        })
      );
      return schemaJson;
    }
  );
  await formatFiles(tree);
}
```

##### Final generator code

```typescript
import {
  Tree,
  updateJson,
  formatFiles,
  ProjectConfiguration,
  getProjects,
} from '@nrwl/devkit';

export default async function (tree: Tree) {
  const scopes = getScopes(getProjects(tree));
  updateSchemaJson(tree, scopes);
  updateSchemaInterface(tree, scopes);
  await formatFiles(tree);
}

function getScopes(projectMap: Map<string, ProjectConfiguration>) {
  const projects: any[] = Array.from(projectMap.values());
  const allScopes: string[] = projects
    .map((project) =>
      project.tags.filter((tag: string) => tag.startsWith('scope:'))
    )
    .reduce((acc, tags) => [...acc, ...tags], [])
    .map((scope: string) => scope.slice(6));
  return Array.from(new Set(allScopes));
}

function updateSchemaJson(tree: Tree, scopes: string[]) {
  updateJson(
    tree,
    'libs/internal-plugin/src/generators/util-lib/schema.json',
    (schemaJson) => {
      schemaJson.properties.directory['x-prompt'].items = scopes.map(
        (scope) => ({
          value: scope,
          label: scope,
        })
      );
      return schemaJson;
    }
  );
}

function updateSchemaInterface(tree: Tree, scopes: string[]) {
  const joinScopes = scopes.map((s) => `'${s}'`).join(' | ');
  const interfaceDefinitionFilePath =
    'libs/internal-plugin/src/generators/util-lib/schema.d.ts';
  const newContent = `export interface UtilLibGeneratorSchema {
  name: string;
  directory: ${joinScopes};
}`;
  tree.write(interfaceDefinitionFilePath, newContent);
}
```

##### BONUS 1 SOLUTION

```typescript
function addScopeIfMissing(host: Tree) {
  const projectMap = getProjects(host);
  Array.from(projectMap.keys()).forEach((projectName) => {
    const project = projectMap.get(projectName);
    if (!project.tags.some((tag) => tag.startsWith('scope:'))) {
      const scope = projectName.split('-')[0];
      project.tags.push(`scope:${scope}`);
      updateProjectConfiguration(host, projectName, project);
    }
  });
}
```

##### BONUS 2 SOLUTION

```json
{
  "scripts": {
    "postinstall": "husky install",
    "pre-commit": "npx nx workspace-generator update-scope-schema"
  }
}
```

##### BONUS 3 SOLUTION: TESTING

```typescript
import { readJson, Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { libraryGenerator } from '@nrwl/workspace/generators';
import { generatorGenerator, pluginGenerator } from '@nrwl/nx-plugin/generators';
import { readFileSync } from 'fs';
import { join } from 'path';

import { Linter } from '@nrwl/linter';
import generator from './generator';

describe('update-scope-schema generator', () => {
  let appTree: Tree;

  beforeEach(async () => {
    appTree = createTreeWithEmptyWorkspace();
    await addUtilLibProject(appTree);
    await libraryGenerator(appTree, { name: 'foo', tags: 'scope:foo' });
    await libraryGenerator(appTree, { name: 'bar', tags: 'scope:bar' });
  });

  it('should adjust the util-lib generator based on existing projects', async () => {
    await generator(appTree);
    const schemaJson = readJson(
      appTree,
      'libs/internal-plugin/src/generators/util-lib/schema.json'
    );
    expect(schemaJson.properties.directory['x-prompt'].items).toEqual([
      {
        value: 'foo',
        label: 'foo',
      },
      {
        value: 'bar',
        label: 'bar',
      },
    ]);
    const schemaInterface = appTree.read(
      'libs/internal-plugin/src/generators/util-lib/schema.d.ts',
      'utf-8'
    );
    expect(schemaInterface).toContain(`export interface UtilLibGeneratorSchema {
  name: string;
  directory: 'foo' | 'bar';
}`);
  });
});

async function addUtilLibProject(tree: Tree) {
  await pluginGenerator(tree, {
    name: 'internal-plugin',
    skipTsConfig: false,
    unitTestRunner: 'jest',
    linter: Linter.EsLint,
    compiler: 'tsc',
    skipFormat: false,
    skipLintChecks: false,
    minimal: true,
  });
  await generatorGenerator(tree, {
    name: 'util-lib',
    project: 'internal-plugin',
    unitTestRunner: 'jest',
  });
  const filesToCopy = [
    '../util-lib/generator.ts',
    '../util-lib/schema.json',
    '../util-lib/schema.d.ts',
  ];
  for (const file of filesToCopy) {
    tree.write(
      `libs/internal-plugin/src/generators/util-lib/${file}`,
      readFileSync(join(__dirname, file))
    );
  }
}
```
