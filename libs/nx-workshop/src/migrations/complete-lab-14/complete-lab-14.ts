/* eslint-disable @typescript-eslint/no-unused-vars */
import { formatFiles, Tree } from '@nrwl/devkit';
import generatorGenerator from '@nrwl/nx-plugin/src/generators/generator/generator';

export default async function update(host: Tree) {
  await generatorGenerator(host, {
    name: 'update-scope-schema',
    project: 'internal-plugin',
    unitTestRunner: 'jest',
  });

  host.write(
    'libs/internal-plugin/src/generators/update-scope-schema/generator.ts',
    `
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

  host.write(
    'tools/generators/util-lib/index.ts',
    `
    import {
      formatFiles,
      ProjectConfiguration,
      Tree,
      updateJson,
    } from '@nrwl/devkit';
    import { getProjects } from '@nrwl/devkit/src/generators/project-configuration';

    function getScopes(projectMap: Map<string, ProjectConfiguration>) {
      const projects: any[] = Object.values(projectMap);
      const allScopes: string[] = projects
        .map((project) =>
          project.tags.filter((tag: string) => tag.startsWith('scope:'))
        )
        .reduce((acc, tags) => [...acc, ...tags], [])
        .map((scope: string) => scope.slice(6));
      return [...new Set(allScopes)];
    }

    function replaceScopes(content: string, scopes: string[]): string {
      const joinScopes = scopes.map((s) => \`'\${s}'\`).join(' | ');
      const PATTERN = /interface Schema \\{\\n.*\\n.*\\n\\}/gm;
      return content.replace(
        PATTERN,
        \`interface Schema {
          name: string;
          directory: \${joinScopes};
        }\`
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
`
  );
  await formatFiles(host);
}
