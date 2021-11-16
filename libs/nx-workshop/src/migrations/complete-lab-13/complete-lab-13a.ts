/* eslint-disable @typescript-eslint/no-unused-vars */
import { Tree } from '@nrwl/devkit';
import workspaceGenerator from '@nrwl/workspace/src/generators/workspace-generator/workspace-generator';

export default function update(host: Tree) {
  // nx generate @nrwl/workspace:workspace-generator util-lib
  workspaceGenerator(host, {
    name: 'util-lib',
    skipFormat: true,
  });

  host.write(
    'tools/generators/util-lib/index.ts',
    `
    import { Tree, formatFiles, installPackagesTask } from '@nrwl/devkit';
    import { libraryGenerator } from '@nrwl/workspace/generators';

    export default async function(host: Tree, schema: any) {
      await libraryGenerator(host, {
        name: \`util-\${schema.name}\`,
        directory: schema.directory,
        tags: \`type:util, scope:\${schema.directory}\`
      });
      await formatFiles(host);
      return () => {
        installPackagesTask(host);
      };
    }
        `
  );
  host.write(
    'tools/generators/util-lib/schema.d.ts',
    `
    interface Schema {
      name: string;
      directory: 'store' | 'api' | 'shared';
    }
`
  );
  host.write(
    'tools/generators/util-lib/schema.json',
    `
  {
    "cli": "nx",
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
`
  );
}
