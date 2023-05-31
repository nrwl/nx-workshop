/* eslint-disable @typescript-eslint/no-unused-vars */
import { libraryGenerator } from '@nx/angular/generators';
import { insertNgModuleImport } from '@nx/angular/src/generators/utils';
import { formatFiles, Tree } from '@nx/devkit';
import { wrapAngularDevkitSchematic } from '@nx/devkit/ngcli-adapter';
import { insertImport } from '@nx/workspace/src/generators/utils/insert-import';
import { replaceInFile } from '../utils';

export default async function update(host: Tree) {
  const appRoutingPath = 'apps/store/src/app/app.routes.ts';
  // nx generate @nx/angular:lib feature-game-detail --directory=store --lazy --routing --parent="apps/store/src/app/app.routes.ts"
  await libraryGenerator(host, {
    name: 'feature-game-detail',
    directory: 'store',
    lazy: true,
    routing: true,
    parent: appRoutingPath,
  });

  replaceInFile(
    host,
    appRoutingPath,
    `path: 'store-feature-game-detail'`,
    `path: 'game/:id'`
  );

  const gameDetailRoutesPath =
    'libs/store/feature-game-detail/src/lib/lib.routes.ts';
  host.write(
    gameDetailRoutesPath,
    `import { Route } from '@angular/router';
import { GameDetailComponent } from './game-detail/game-detail.component';

export const storeFeatureGameDetailRoutes: Route[] = [
  { path: '', pathMatch: 'full', component: GameDetailComponent }
];`
  );

  // Add MatCardModule to StoreFeatureGameDetailModule imports
  const gameDetailModulePath =
    'libs/store/feature-game-detail/src/lib/store-feature-game-detail.module.ts';
  insertNgModuleImport(host, gameDetailModulePath, 'MatCardModule');
  insertImport(
    host,
    gameDetailModulePath,
    'MatCardModule',
    '@angular/material/card'
  );

  // nx generate @nx/angular:component game-detail --project=store-feature-game-detail
  const componentGenerator = wrapAngularDevkitSchematic(
    '@schematics/angular',
    'component'
  );
  await componentGenerator(host, {
    name: 'game-detail',
    project: 'store-feature-game-detail',
  });
  host.write(
    'libs/store/feature-game-detail/src/lib/game-detail/game-detail.component.css',
    `.game-image {
      width: 300px;
      border-radius: 20px;
      margin-right: 20px;
    }

    .content {
      display: flex;
    }

    .details {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .sell-info {
      display: flex;
      flex-direction: column;
    }

    .buy-button {
      margin-right: 20px;
    }
    `
  );
  host.write(
    'libs/store/feature-game-detail/src/lib/game-detail/game-detail.component.html',
    `<mat-card>
    {{ gameId$ | async }}
  </mat-card>
  `
  );
  host.write(
    'libs/store/feature-game-detail/src/lib/game-detail/game-detail.component.ts',
    `import { Component } from '@angular/core';
    import { ActivatedRoute, ParamMap } from '@angular/router';
    import { map } from 'rxjs/operators';

    @Component({
      selector: 'bg-hoard-game-detail',
      templateUrl: './game-detail.component.html',
      styleUrls: ['./game-detail.component.css']
    })
    export class GameDetailComponent {
      constructor(private route: ActivatedRoute) {}

      gameId$ = this.route.paramMap.pipe(
        map((params: ParamMap) => params.get('id'))
      );
    }
    `
  );

  const appComponentHtmlPath = 'apps/store/src/app/app.component.html';
  replaceInFile(
    host,
    appComponentHtmlPath,
    `  </div>
</div>`,
    `  </div>
  <router-outlet></router-outlet>
</div>`
  );
  replaceInFile(
    host,
    appComponentHtmlPath,
    '<mat-card class="game-card" *ngFor="let game of games">',
    '<mat-card class="game-card" *ngFor="let game of games" [routerLink]="[\'/game\', game.id]">'
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
      it('should navigate to game details', () => {
        cy.contains('Settlers in the Can').click();
        cy.location('pathname').should('contain', 'settlers-in-the-can');
      });
    });
      
  `
  );
  await formatFiles(host);
}
