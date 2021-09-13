import {
  Tree,
  formatFiles,
  installPackagesTask,
  generateFiles,
} from '@nrwl/devkit';
import { runCommandsGenerator } from '@nrwl/workspace/generators';
import { join } from 'path';

interface Schema {
  project: string;
  subdomain: string;
}

export default async function (host: Tree, schema: Schema) {
  await runCommandsGenerator(host, {
    name: 'deploy',
    project: schema.project,
    command: `surge dist/apps/${
      schema.project
    } \${SURGE_DOMAIN_${underscoreWithCaps(
      schema.project
    )}} --token \${SURGE_TOKEN}`,
  });
  await generateFiles(
    host,
    join(__dirname, './files'),
    `apps/${schema.project}`,
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
