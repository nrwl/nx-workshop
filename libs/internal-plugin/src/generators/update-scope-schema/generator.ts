import { formatFiles, getProjects, installPackagesTask, ProjectConfiguration, Tree, updateJson, updateProjectConfiguration } from '@nrwl/devkit';
import { UpdateScopeSchemaGeneratorSchema } from './schema';

function getScopes(projectMap: Map<string, ProjectConfiguration>): string[] {
  const projects: ProjectConfiguration[] = Array.from(projectMap.values());
  const allScopes: string[] = projects
    .map((project) =>
      project.tags.filter((tag: string) => tag.startsWith('scope:'))
    )
    .reduce((acc, tags) => [...acc, ...tags], [])
    .map((scope: string) => scope.slice(6));
  return Array.from(new Set(allScopes));
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

export default async function (tree: Tree, schema: UpdateScopeSchemaGeneratorSchema) {
  addScopeIfMissing(tree);
  const scopes = getScopes(getProjects(tree));
  updateJson(tree, 'libs/internal-plugin/src/generators/util-lib/schema.json', (schemaJson) => {
    schemaJson.properties.directory['x-prompt'].items = scopes.map(scope => ({
      value: scope,
      label: scope
    }));
    return schemaJson;
  });
  updateSchemaInterface(tree, scopes);
  await formatFiles(tree);
  return () => {
    installPackagesTask(tree);
  };
}
