/* eslint-disable @typescript-eslint/no-unused-vars */
import { Tree } from '@nrwl/devkit';
import workspaceGenerator from '@nrwl/workspace/src/generators/workspace-generator/workspace-generator';

export default function update(host: Tree) {
  // nx generate @nrwl/workspace:workspace-generator update-scope-schema
  workspaceGenerator(host, {
    name: 'update-scope-schema',
    skipFormat: true,
  });

  host.write(
    'tools/generators/update-scope-schema/index.ts',
    `
    import { formatFiles, Tree, updateJson } from '@nrwl/devkit';

    export default async function(host: Tree) {
      updateJson(host, 'workspace.json', (json) => {
        json.defaultProject = 'api';
        return json;
      });
      await formatFiles(host);
    }
`
  );
  host.write(
    'tools/generators/update-scope-schema/schema.json',
    `
  {
    "cli": "nx"
  }
`
  );

  host.write(
    'tools/generators/util-lib/index.ts',
    `
    import { Tree, updateJson, formatFiles, readJson } from '@nrwl/devkit';

    function getScopes(nxJson: any) {
      const projects: any[] = Object.values(nxJson.projects);
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
      const scopes = getScopes(readJson(host, 'nx.json'));
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
}
