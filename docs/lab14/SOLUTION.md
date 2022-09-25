##### Generate a `update-scope-schema` workspace generator:

```shell script
nx generate @nrwl/workspace:workspace-generator update-scope-schema
```

##### Change default project

```typescript
import {Tree, updateJson, formatFiles, ProjectConfiguration, getProjects} from '@nrwl/devkit';

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

export default async function (host: Tree) {
  const scopes = getScopes(getProjects(host));
  updateJson(host, 'tools/generators/util-lib/schema.json', (schemaJson) => {
    schemaJson.properties.directory['x-prompt'].items = scopes.map((scope) => ({
      value: scope,
      label: scope,
    }));
    return schemaJson;
  });
  await formatFiles(host);
}
```

##### Final generator code

```typescript
import {Tree, updateJson, formatFiles, ProjectConfiguration, getProjects} from '@nrwl/devkit';

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

function replaceScopes(content: string, scopes: string[]): string {
  const joinScopes = scopes.map((s) => `'${s}'`).join(' | ');
  const PATTERN = /interface Schema \{\n.*\n.*\n\}/gm;
  return content.replace(
    PATTERN,
    `interface Schema {
      name: string;
      directory: ${joinScopes};
    }`
  );
}

export default async function (host: Tree) {
  const scopes = getScopes(getProjects(host));
  updateJson(host, 'tools/generators/util-lib/schema.json', (schemaJson) => {
    schemaJson.properties.directory['x-prompt'].items = scopes.map((scope) => ({
      value: scope,
      label: scope,
    }));
    return schemaJson;
  });
  const content = host.read('tools/generators/util-lib/index.ts', 'utf-8');
  const newContent = replaceScopes(content, scopes);
  host.write('tools/generators/util-lib/index.ts', newContent);
  await formatFiles(host);
}
```

##### BONUS 1 SOLUTION

```typescript
function addScopeIfMissing(host: Tree) {
  const projectMap = getProjects(host);
  Object.keys(projectMap).forEach((projectName) => {
    const project = projectMap[projectName];
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
    "pre-commit": "yarn nx workspace-generator update-scope-schema"
  }
}
```
