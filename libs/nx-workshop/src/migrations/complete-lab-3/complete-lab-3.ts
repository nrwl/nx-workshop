import {
  formatFiles,
  readProjectConfiguration,
  Tree,
  updateProjectConfiguration,
} from '@nx/devkit';

export default async function update(host: Tree) {
  process.env.NX_PROJECT_GLOB_CACHE = 'false';
  const config = readProjectConfiguration(host, 'store');
  config.targets['build'].options.styles = Array.from(
    new Set([
      ...config.targets['build'].options.styles,
      `./node_modules/@angular/material/prebuilt-themes/deeppurple-amber.css`,
    ])
  );
  updateProjectConfiguration(host, 'store', config);
  process.env.NX_PROJECT_GLOB_CACHE = 'true';
  await formatFiles(host);
}
