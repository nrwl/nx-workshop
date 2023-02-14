/* eslint-disable @typescript-eslint/no-unused-vars */
import { formatFiles, Tree } from '@nrwl/devkit';
import { generatorGenerator } from '@nrwl/nx-plugin/generators';

export default async function update(host: Tree) {
  process.env.NX_PROJECT_GLOB_CACHE = 'false';
  await generatorGenerator(host, {
    name: 'update-scope-schema',
    project: 'internal-plugin',
    unitTestRunner: 'jest',
  });
  process.env.NX_PROJECT_GLOB_CACHE = 'true';

  host.write(
    'libs/internal-plugin/src/generators/update-scope-schema/generator.ts',
    `import {
  Tree,
  updateJson,
  formatFiles,
  ProjectConfiguration,
  getProjects,
  updateProjectConfiguration,
} from '@nrwl/devkit';

export default async function (tree: Tree) {
  addScopeIfMissing(tree);
  const scopes = getScopes(getProjects(tree));
  updateSchemaJson(tree, scopes);
  updateSchemaInterface(tree, scopes);
  await formatFiles(tree);
}

function addScopeIfMissing(tree: Tree) {
  const projectMap = getProjects(tree);
  Array.from(projectMap.keys()).forEach((projectName) => {
    const project = projectMap.get(projectName);
    if (!project.tags.some((tag) => tag.startsWith('scope:'))) {
      const scope = projectName.split('-')[0];
      project.tags.push(\`scope:\${scope}\`);
      updateProjectConfiguration(tree, projectName, project);
    }
  });
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
  const joinScopes = scopes.map((s) => \`'\${s}'\`).join(' | ');
  const interfaceDefinitionFilePath =
    'libs/internal-plugin/src/generators/util-lib/schema.d.ts';
  const newContent = \`export interface UtilLibGeneratorSchema {
  name: string;
  directory: \${joinScopes};
}\`;
  tree.write(interfaceDefinitionFilePath, newContent);
}
`
  );

  host.write(
    'libs/internal-plugin/src/generators/update-scope-schema/schema.json',
    `
    {
      "$schema": "http://json-schema.org/schema",
      "cli": "nx",
      "$id": "UpdateScopeSchema",
      "properties": {}
    }

`
  );

  host.delete(
    'libs/internal-plugin/src/generators/update-scope-schema/schema.d.ts'
  );

  await formatFiles(host);
}
