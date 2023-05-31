/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  addDependenciesToPackageJson,
  formatFiles,
  installPackagesTask,
  Tree,
} from '@nx/devkit';
import { applicationGenerator } from '@nx/nest';
import { runCommandsGenerator } from '@nx/workspace';
import workspaceGenerator from '@nx/workspace/src/generators/workspace-generator/workspace-generator';
import { dependencies } from '../../../package.json';

export default async function update(host: Tree) {
  // yarn add @nx/nest # or "npm i -S @nx/nest"
  addDependenciesToPackageJson(
    host,
    {},
    {
      '@nx/nest': dependencies['@nx/nest'],
    }
  );
  // nx g @nx/nest:app admin-ui
  await applicationGenerator(host, {
    name: 'admin-ui',
  });
  // nx generate run-commands deploy --project=admin-ui --command="surge dist/apps/admin-ui/exported \${SURGE_DOMAIN_ADMIN_UI} --token \${SURGE_TOKEN}"
  runCommandsGenerator(host, {
    name: 'deploy',
    project: 'admin-ui',
    command:
      'surge dist/apps/admin-ui/exported ${SURGE_DOMAIN_ADMIN_UI} --token ${SURGE_TOKEN}',
  });

  // nx g workspace-generator add-deploy-target
  workspaceGenerator(host, {
    name: 'add-deploy-target',
    skipFormat: true,
  });

  host.write(
    `tools/generators/add-deploy-target/files/.local.env`,
    `
SURGE_DOMAIN_<%= undercaps(project) %>=https://<%= subdomain %>.surge.sh
`
  );

  host.write(
    `tools/generators/add-deploy-target/index.ts`,
    `
import {
  Tree,
  formatFiles,
  installPackagesTask,
  generateFiles,
} from '@nx/devkit';
import { runCommandsGenerator } from '@nx/js';
import { join } from 'path';

interface Schema {
  project: string;
  subdomain: string;
}

export default async function (host: Tree, schema: Schema) {
  await runCommandsGenerator(host, {
    name: 'deploy',
    project: schema.project,
    command: \`surge dist/apps/\${
      schema.project
    } \\\${SURGE_DOMAIN_\${underscoreWithCaps(
      schema.project
    )}} --token \\\${SURGE_TOKEN}\`,
  });
  await generateFiles(
    host,
    join(__dirname, './files'),
    \`apps/\${schema.project}\`,
    {
      tmpl: '',
      project: schema.project,
      subdomain: schema.subdomain,
      undercaps: underscoreWithCaps,
    }
  );
  await formatFiles(host);
  return () => {
    installPackagesTask(host);
  };
}

export function underscoreWithCaps(value: string): string {
  return value.replace(/-/g, '_').toLocaleUpperCase();
}
`
  );

  host.write(
    `tools/generators/add-deploy-target/schema.json`,
    `
{
  "cli": "nx",
  "id": "add-deploy-target",
  "type": "object",
  "properties": {
    "project": {
      "type": "string",
      "description": "Project name to generate the deploy target for",
      "$default": {
        "$source": "argv",
        "index": 0
      }
    },
    "subdomain": {
      "type": "string",
      "description": "Surge subdomain where you want it deployed.",
      "x-prompt": "What is the Surge subdomain you want it deployed under? (https://<your-subdomain>.surge.sh)"
    }
  },
  "required": ["project", "subdomain"]
}
`
  );
  await formatFiles(host);
  return async () => {
    installPackagesTask(host);
  };
}
