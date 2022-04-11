import {
  formatFiles,
  readProjectConfiguration,
  Tree,
  updateProjectConfiguration,
} from '@nrwl/devkit';

export default async function update(host: Tree) {
  const config = readProjectConfiguration(host, 'store');
  config.targets['build'].options.styles = Array.from(
    new Set([
      ...config.targets['build'].options.styles,
      `./node_modules/@angular/material/prebuilt-themes/deeppurple-amber.css`,
    ])
  );
  updateProjectConfiguration(host, 'store', config);
  await formatFiles(host);
}
