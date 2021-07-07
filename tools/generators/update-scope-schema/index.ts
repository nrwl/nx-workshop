import { Tree, formatFiles } from '@nrwl/devkit';
import { readJson, updateJson } from '@nrwl/devkit';

export default async function (host: Tree, schema: any) {
  addScopesIfMissing(host);
  const nxJson = readJson(host, 'nx.json');
  const scopes = getScopes(nxJson);
  updateJson(host, 'tools/generators/util-lib/schema.json', (json) => {
    json.properties.directory.enum = scopes;
    json.properties.directory['x-prompt'].items = scopes.map(scope => {
      return { value: scope, label: `${scope} scope`}
    })
    return json;
  });

  const utilLibPath = 'tools/generators/util-lib/index.ts';
  const utilLibContent = host.read(utilLibPath, 'utf-8');
  const updatedLibContent = replaceScopes(utilLibContent, scopes);
  host.write(utilLibPath, updatedLibContent);

  await formatFiles(host);
}

function addScopesIfMissing(host: Tree) {
  updateJson(host, 'nx.json', (json) => {
    Object.keys(json.projects).forEach(projectName => {
      const tags: string[]= json.projects[projectName].tags;
      if (!tags.some(tags => tags.startsWith('scope:'))) {
        const scope = projectName.split('-')[0];
        json.projects[projectName].tags.push(`scope:${scope}`);
      }
    })
    return json;
  });
}

function getScopes(nxJson: any) {
  const projects: any[] = Object.values(nxJson.projects);
  const allScopes: string[] = projects
    .map(project => project.tags
      // take only those that point to scope
      .filter((tag: string) => tag.startsWith('scope:'))
    )
    // flatten the array
    .reduce((acc, tags) => [...acc, ...tags], [])
    // remove prefix `scope:`
    .map((scope: string) => scope.slice(6));
  // remove duplicates
  return [...new Set(allScopes)];
}

function replaceScopes(content: string, scopes: string[]): string {
  const joinScopes = scopes.map(s => `'${s}'`).join(' | ');
  const PATTERN = /interface LibSchema \{\n.*\n.*\n\}/gm;
  return content.replace(PATTERN,
    `interface LibSchema {
  name: string;
  directory: ${joinScopes};
}`
  );
}
