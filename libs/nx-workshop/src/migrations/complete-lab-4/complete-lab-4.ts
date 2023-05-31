/* eslint-disable @typescript-eslint/no-unused-vars */
import { formatFiles, Tree } from '@nx/devkit';
import { libraryGenerator } from '@nx/angular/generators';
import { wrapAngularDevkitSchematic } from '@nx/devkit/ngcli-adapter';
import { insertNgModuleImport } from '@nx/angular/src/generators/utils';
import { insertImport } from '@nx/workspace/src/generators/utils/insert-import';

export default async function update(tree: Tree) {
  // nx generate @nx/angular:lib ui-shared --directory=store
  await libraryGenerator(tree, {
    name: 'ui-shared',
    directory: 'store',
  });
  // nx generate @nx/angular:component header --export --project=store-ui-shared
  const componentGenerator = wrapAngularDevkitSchematic(
    '@schematics/angular',
    'component'
  );
  await componentGenerator(tree, {
    name: 'header',
    project: 'store-ui-shared',
    export: true,
  });

  // Add MatToolbarModule to AppModule imports
  const modulePath = 'libs/store/ui-shared/src/lib/store-ui-shared.module.ts';
  insertNgModuleImport(tree, modulePath, 'MatToolbarModule');
  insertImport(
    tree,
    modulePath,
    'MatToolbarModule',
    '@angular/material/toolbar'
  );

  tree.write(
    'libs/store/ui-shared/src/lib/header/header.component.html',
    `<mat-toolbar color="primary">
    {{ title }}
  </mat-toolbar>`
  );
  tree.write(
    'libs/store/ui-shared/src/lib/header/header.component.ts',
    `import { Component, Input } from '@angular/core';

    @Component({
      selector: 'bg-hoard-header',
      templateUrl: './header.component.html',
      styleUrls: ['./header.component.css']
    })
    export class HeaderComponent {
      @Input() title = '';
    }`
  );

  // Add StoreUiSharedModule to AppModule imports
  const appModulePath = 'apps/store/src/app/app.module.ts';
  insertNgModuleImport(tree, appModulePath, 'StoreUiSharedModule');
  insertImport(
    tree,
    appModulePath,
    'StoreUiSharedModule',
    '@bg-hoard/store/ui-shared'
  );

  tree.write(
    'apps/store/src/app/app.component.html',
    `<bg-hoard-header title="Board Game Hoard"></bg-hoard-header>
    <div class="container">
     <div class="games-layout">
      <mat-card class="game-card" *ngFor="let game of games">
        <mat-card-header class="center-content">
          <mat-card-title>{{ game.name }}</mat-card-title>
        </mat-card-header>
        <img
          mat-card-image
          src="{{ game.image }}"
          alt="Photo of board game {{ game.name }}"
        />
        <mat-card-content>
          <p>
            {{ game.description }}
          </p>
          <span>
            <span style="font-weight: bold;">Rating:</span> {{ game.rating }}
          </span>
        </mat-card-content>
      </mat-card>
    </div>
  </div>
  `
  );
  tree.write(
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
  });
  `
  );

  await formatFiles(tree);
}
