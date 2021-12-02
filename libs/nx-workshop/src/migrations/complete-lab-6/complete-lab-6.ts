/* eslint-disable @typescript-eslint/no-unused-vars */
import { libraryGenerator } from '@nrwl/angular/generators';
import { insertNgModuleImport } from '@nrwl/angular/src/generators/utils';
import { formatFiles, Tree } from '@nrwl/devkit';
import { wrapAngularDevkitSchematic } from '@nrwl/devkit/ngcli-adapter';
import { insertImport } from '@nrwl/workspace/src/generators/utils/insert-import';
import { replaceInFile } from '../utils';

export default async function update(host: Tree) {
  const appModulePath = 'apps/store/src/app/app.module.ts';
  // nx generate @nrwl/angular:lib feature-game-detail --directory=store --lazy --routing --parentModule="apps/store/src/app/app.module.ts"
  await libraryGenerator(host, {
    name: 'feature-game-detail',
    directory: 'store',
    lazy: true,
    routing: true,
    parentModule: appModulePath,
  });

  replaceInFile(
    host,
    appModulePath,
    `path: 'store-feature-game-detail'`,
    `path: 'game/:id'`
  );

  const gameDetailModulePath =
    'libs/store/feature-game-detail/src/lib/store-feature-game-detail.module.ts';
  replaceInFile(
    host,
    gameDetailModulePath,
    `/* {path: '', pathMatch: 'full', component: InsertYourComponentHere} */`,
    `{ path: '', pathMatch: 'full', component: GameDetailComponent }`
  );

  // Add MatCardModule to StoreFeatureGameDetailModule imports
  insertNgModuleImport(host, gameDetailModulePath, 'MatCardModule');
  insertImport(
    host,
    gameDetailModulePath,
    'MatCardModule',
    '@angular/material/card'
  );

  // nx generate @nrwl/angular:component game-detail --project=store-feature-game-detail
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
  await formatFiles(host);
}
