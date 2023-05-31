/* eslint-disable @typescript-eslint/no-unused-vars */
import { formatFiles, Tree } from '@nx/devkit';
import { libraryGenerator } from '@nx/js';
import { replaceInFile } from '../utils';

export default async function update(host: Tree) {
  // nx generate @nx/js:lib util-formatters --directory=store
  await libraryGenerator(host, {
    name: 'util-formatters',
    directory: 'store',
  });

  host.write(
    'libs/store/util-formatters/src/lib/store-util-formatters.ts',
    `export function formatRating(rating = 0) {
  return \`\${Math.round(rating * 100) / 10} / 10\`;
}
`
  );

  host.write(
    'apps/store/src/app/app.component.ts',
    `import { Component } from '@angular/core';
    import { getAllGames } from '../fake-api';
    import { formatRating } from '@bg-hoard/store/util-formatters';

    @Component({
      selector: 'bg-hoard-root',
      templateUrl: './app.component.html',
      styleUrls: ['./app.component.css']
    })
    export class AppComponent {
      formatRating = formatRating;
      title = 'Board Game Hoard';
      games = getAllGames();
    }`
  );

  replaceInFile(
    host,
    'apps/store/src/app/app.component.html',
    '{{ game.rating }}',
    '{{ formatRating(game.rating) }}'
  );
  host.write(
    'apps/store-e2e/cypress.config.ts',
    `import { defineConfig } from 'cypress';
import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';
import { execSync } from 'child_process';

export default defineConfig({
  e2e: {
    ...nxE2EPreset(__dirname),
    setupNodeEvents(on, config) {
      on('task', {
        showProjects() {
          return execSync('nx show projects').toString();
        },
      });
    },
  },
});`
  );
  host.write(
    'apps/store-e2e/src/e2e/app.cy.ts',
    `describe('store', () => {
      beforeEach(() => cy.visit('/'));
    
      it('should have 3 games', () => {
        cy.contains('Settlers in the Can');
        cy.contains('Chess Pie');
        cy.contains('Purrfection');
      });
      it('should have a header', () => {
        cy.contains('Board Game Hoard');
      });
      it('should have a store-util-formatters library', () => {
        cy.task('showProjects').should('contain', 'store-util-formatters');
      });
    });
`
  );

  await formatFiles(host);
}
