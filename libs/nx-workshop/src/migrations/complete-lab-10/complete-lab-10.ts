/* eslint-disable @typescript-eslint/no-unused-vars */
import { addDependenciesToPackageJson, formatFiles, Tree } from '@nrwl/devkit';
import { storybookConfigurationGenerator } from '@nrwl/angular/generators';
import { dependencies } from '../../../package.json';
import { Linter } from '@nrwl/linter';
import { insertImport } from '../utils';

export default async function update(host: Tree) {
  // yarn add @nrwl/storybook
  await addDependenciesToPackageJson(
    host,
    {},
    {
      '@nrwl/storybook': dependencies['@nrwl/storybook'],
    }
  );
  // nx generate @nrwl/angular:storybook-configuration store-ui-shared
  await storybookConfigurationGenerator(host, {
    name: 'store-ui-shared',
    configureCypress: true,
    generateStories: true,
    generateCypressSpecs: true,
    linter: Linter.EsLint,
  });

  const headerComponentStoriesPath = `libs/store/ui-shared/src/lib/header/header.component.stories.ts`;
  insertImport(
    host,
    headerComponentStoriesPath,
    'MatToolbarModule',
    '@angular/material/toolbar'
  );
  host.write(
    headerComponentStoriesPath,
    host
      .read(headerComponentStoriesPath)
      .toString()
      .replace('imports: []', 'imports: [MatToolbarModule]')
  );
  await formatFiles(host);
}
