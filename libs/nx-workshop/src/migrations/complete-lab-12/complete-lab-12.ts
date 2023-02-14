/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  formatFiles,
  readProjectConfiguration,
  Tree,
  updateJson,
  updateProjectConfiguration,
} from '@nrwl/devkit';

export default async function update(host: Tree) {
  const projectUpdates = {
    store: {
      tags: ['scope:store', 'type:app'],
    },
    'store-e2e': {
      tags: ['scope:store', 'type:e2e'],
      implicitDependencies: ['store'],
    },
    'store-ui-shared': {
      tags: ['scope:store', 'type:ui'],
    },
    'store-util-formatters': {
      tags: ['scope:store', 'type:util'],
    },
    'store-feature-game-detail': {
      tags: ['scope:store', 'type:feature'],
    },
    api: {
      tags: ['scope:api', 'type:app'],
    },
    'util-interface': {
      tags: ['scope:shared', 'type:util'],
    },
    'store-ui-shared-e2e': {
      tags: ['scope:store', 'type:e2e'],
      implicitDependencies: ['store-ui-shared'],
    },
  };
  process.env.NX_PROJECT_GLOB_CACHE = 'false';
  Object.keys(projectUpdates).forEach((projectName) => {
    const config = readProjectConfiguration(host, projectName);
    config.tags = projectUpdates[projectName].tags;
    config.implicitDependencies =
      projectUpdates[projectName].implicitDependencies || [];
    updateProjectConfiguration(host, projectName, config);
  });
  process.env.NX_PROJECT_GLOB_CACHE = 'true';

  updateJson(host, '.eslintrc.json', (json) => {
    json.overrides[0].rules[
      '@nrwl/nx/enforce-module-boundaries'
    ][1].depConstraints = [
      {
        sourceTag: 'scope:store',
        onlyDependOnLibsWithTags: ['scope:store', 'scope:shared'],
      },
      {
        sourceTag: 'scope:api',
        onlyDependOnLibsWithTags: ['scope:api', 'scope:shared'],
      },
      {
        sourceTag: 'type:feature',
        onlyDependOnLibsWithTags: ['type:feature', 'type:ui', 'type:util'],
      },
      {
        sourceTag: 'type:ui',
        onlyDependOnLibsWithTags: ['type:ui', 'type:util'],
      },
      {
        sourceTag: 'type:util',
        onlyDependOnLibsWithTags: ['type:util'],
      },
    ];
    return json;
  });
  await formatFiles(host);
}
