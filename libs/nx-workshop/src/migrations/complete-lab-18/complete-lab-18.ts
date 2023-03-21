/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  addDependenciesToPackageJson,
  readProjectConfiguration,
  Tree,
  updateJson,
  updateProjectConfiguration,
} from '@nrwl/devkit';
import { uniq } from '@nrwl/nx-plugin/testing';
import { formatFiles, runCommandsGenerator } from '@nrwl/workspace';
import { execSync } from 'child_process';
import { readJsonFile } from '@nrwl/devkit';
import { stripConsoleColors } from '../utils';

export default async function update(host: Tree) {
  await addDependenciesToPackageJson(
    host,
    {},
    {
      surge: '0.23.1',
    }
  );

  let surgeToken, surgeName;
  if (host.exists('.nx-workshop.json')) {
    const workshopConstants = readJsonFile('.nx-workshop.json');
    surgeToken = workshopConstants.surgeToken;
    surgeName = workshopConstants.surgeName;
  }
  if (!surgeToken || !surgeName) {
    surgeToken = stripConsoleColors(
      execSync('npx surge token').toString().trim()
    );
    surgeName = uniq(`prophetic-narwhal-`);
    if (host.exists('.nx-workshop.json')) {
      updateJson(host, '.nx-workshop.json', (json) => {
        json.surgeToken = surgeToken;
        json.surgeName = surgeName;
        return json;
      });
    } else {
      host.write(
        '.nx-workshop.json',
        JSON.stringify({ surgeToken, surgeName })
      );
    }
  }

  host.write('apps/store/.local.env', `SURGE_TOKEN=${surgeToken}\nSURGE_DOMAIN=https://${surgeName}.surge.sh`);

  // nx generate run-commands deploy --project=store --command="surge dist/apps/store https://<chose-some-unique-url-123>.surge.sh --token <your-surge-token>"
  runCommandsGenerator(host, {
    name: 'deploy',
    project: 'store',
    command: `surge dist/apps/store \${SURGE_DOMAIN} --token \${SURGE_TOKEN}`,
  });
  const config = readProjectConfiguration(host, 'store');
  config.targets['deploy'].dependsOn = ['build'];
  updateProjectConfiguration(host, 'store', config);

  await formatFiles();
}
