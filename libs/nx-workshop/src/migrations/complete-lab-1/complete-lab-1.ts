/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  addDependenciesToPackageJson,
  formatFiles,
  Tree,
  updateJson,
  getProjects,
  readJson,
  installPackagesTask,
} from '@nrwl/devkit';
import { removeGenerator } from '@nrwl/workspace';
import { execSync } from 'child_process';
import { nxVersion } from '../version';

export default async function update(tree: Tree) {
  // npx create-nx-workspace bg-hoard --preset=empty --no-nx-cloud
  const projects = getProjects(tree);
  const projectsToRemove = [
    'store-e2e',
    'store',
    'api',
    'api-util-interface',
    'util-interface',
    'store-feature-game-detail',
    'store-ui-shared',
    'store-ui-shared-e2e',
    'store-util-formatters',
    'api-util-notifications',
    'admin-ui',
  ].filter((removeProject) => projects.has(removeProject));
  projectsToRemove.forEach(
    async (projectName) =>
      await removeGenerator(tree, {
        projectName,
        skipFormat: true,
        forceRemove: true,
      })
  );
  await addDependenciesToPackageJson(
    tree,
    {
      '@angular/cdk': '^12.2.0',
      '@angular/material': '^12.2.0',
    },
    {
      '@nrwl/angular': nxVersion,
      '@nrwl/nest': nxVersion,
      '@nrwl/nx-cloud': 'latest',
      '@nrwl/nx-plugin': 'latest',
      '@nrwl/storybook': nxVersion,
      cors: '*',
      'node-fetch': '^2.x',
      surge: '*',
    }
  );

  // Lab 10
  tree.delete('.storybook');
  // Lab 13
  tree.delete('tools/generators/util-lib');
  // Lab 14
  tree.delete('tools/generators/update-scope-schema');
  // Lab 15
  tree.delete('.github/workflows/ci.yml');
  // Lab 19
  if (tree.exists('.nx-workshop.json')) {
    const { herokuName } = readJson(tree, '.nx-workshop.json');
    const herokuApps = await execSync(`heroku apps`).toString();
    if (herokuApps.includes(herokuName)) {
      execSync(`heroku apps:destroy ${herokuName} --confirm=${herokuName}`);
    }
    tree.delete('.nx-workshop.json');
  }
  // Lab 19-alt
  tree.delete('tools/generators/add-deploy-target');
  // Lab 21
  tree.delete('.github/workflows/deploy.yml');
  // Set npmScope to bg-hoard
  updateJson(tree, 'nx.json', (json) => {
    json.npmScope = 'bg-hoard';
    return json;
  });
  await formatFiles(tree);
  return () => {
    installPackagesTask(tree);
  };
}
