/* eslint-disable @typescript-eslint/no-unused-vars */
import { addDependenciesToPackageJson, Tree } from '@nrwl/devkit';
import { storybookConfigurationGenerator } from '@nrwl/angular/generators';
import { nxVersion } from '../version';
import { Linter } from '@nrwl/linter';
import { insertImport } from '@nrwl/workspace/src/generators/utils/insert-import';

export default async function update(host: Tree) {
  // yarn add @nrwl/storybook
  await addDependenciesToPackageJson(
    host,
    {},
    {
      '@nrwl/storybook': nxVersion,
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
    "import '@angular/material/prebuilt-themes/deeppurple-amber.css';\n" +
      host
        .read(headerComponentStoriesPath)
        .toString()
        .replace('imports: []', 'imports: [MatToolbarModule]')
  );
}
