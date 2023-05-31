/* eslint-disable @typescript-eslint/no-unused-vars */
import { addDependenciesToPackageJson, formatFiles, Tree } from '@nx/devkit';
import { storybookConfigurationGenerator } from '@nx/angular/generators';
import { dependencies } from '../../../package.json';
import { Linter } from '@nx/linter';
import { insertImport } from '@nx/workspace/src/generators/utils/insert-import';

export default async function update(host: Tree) {
  // add @nx/storybook
  await addDependenciesToPackageJson(
    host,
    {},
    {
      '@nx/storybook': dependencies['@nx/storybook'],
    }
  );
  process.env.NX_PROJECT_GLOB_CACHE = 'false';
  // nx generate @nx/angular:storybook-configuration store-ui-shared
  await storybookConfigurationGenerator(host, {
    name: 'store-ui-shared',
    configureCypress: true,
    generateStories: true,
    generateCypressSpecs: true,
    linter: Linter.EsLint,
  });
  process.env.NX_PROJECT_GLOB_CACHE = 'true';

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
  host.write(
    'apps/store-ui-shared-e2e/src/e2e/header/header.component.cy.ts',
    `
    describe('store-ui-shared', () => {
      beforeEach(() =>
        cy.visit('/iframe.html?id=headercomponent--primary&args=title:BoardGameHoard')
      );
      it('should render the component', () => {
        cy.get('bg-hoard-header').contains('BoardGameHoard');
      });
    });
    `
  );
  await formatFiles(host);
}
