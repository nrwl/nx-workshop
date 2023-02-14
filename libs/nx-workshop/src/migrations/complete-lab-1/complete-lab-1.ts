/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  formatFiles,
  Tree,
  updateJson,
  getProjects,
  readJson,
  installPackagesTask,
} from '@nrwl/devkit';
import { removeGenerator } from '@nrwl/workspace';
import { execSync } from 'child_process';

export default async function update(tree: Tree) {
  // npx create-nx-workspace bg-hoard --preset=empty --no-nx-cloud
  const projects = getProjects(tree);
  const projectsToRemove = [
    'store-e2e',
    'store',
    'api',
    'api-e2e',
    'api-util-interface',
    'util-interface',
    'store-feature-game-detail',
    'ui-shared',
    'store-ui-shared',
    'store-ui-shared-e2e',
    'store-util-formatters',
    'api-util-notifications',
    'video',
    'video-e2e',
    'internal-plugin',
    'internal-plugin-e2e',
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
  // hack to fix remove generator
  updateJson(tree, 'tsconfig.base.json', (json) => {
    json.compilerOptions.paths = {};
    return json;
  });

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
    const { flyName } = readJson(tree, '.nx-workshop.json');
    const flyApps = await execSync(`fly apps list`).toString();
    if (flyApps.includes(flyName)) {
      execSync(`fly apps destroy ${flyName} --yes`);
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
