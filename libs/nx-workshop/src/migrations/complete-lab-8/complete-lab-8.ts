/* eslint-disable @typescript-eslint/no-unused-vars */
import { insertNgModuleImport } from '@nx/angular/src/generators/utils';
import { formatFiles, Tree } from '@nx/devkit';
import { insertImport } from '@nx/workspace/src/generators/utils/insert-import';
import { replaceInFile } from '../utils';

export default async function update(host: Tree) {
  // Add HttpClientModule to StoreFeatureGameDetailModule imports
  const appModulePath = 'apps/store/src/app/app.module.ts';
  insertNgModuleImport(host, appModulePath, 'HttpClientModule');
  insertImport(host, appModulePath, 'HttpClientModule', '@angular/common/http');

  const appComponentPath = 'apps/store/src/app/app.component.ts';
  insertImport(host, appComponentPath, 'HttpClient', '@angular/common/http');
  replaceInFile(
    host,
    appComponentPath,
    `}
`,
    `  constructor(private http: HttpClient) {}
}
`
  );
  replaceInFile(
    host,
    appComponentPath,
    'games = getAllGames();',
    "games = this.http.get<any[]>('/api/games');"
  );

  replaceInFile(
    host,
    'apps/store/src/app/app.component.html',
    `let game of games`,
    `let game of games | async`
  );

  host.write(
    'libs/store/feature-game-detail/src/lib/game-detail/game-detail.component.ts',
    `import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { formatRating } from '@bg-hoard/store/util-formatters';

@Component({
  selector: 'bg-hoard-game-detail',
  templateUrl: './game-detail.component.html',
  styleUrls: ['./game-detail.component.css']
})
export class GameDetailComponent {
  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  game$ = this.route.paramMap.pipe(
    map((params: ParamMap) => params.get('id')),
    switchMap(id => this.http.get<any>(\`/api/games/\${id}\`))
  );
  formatRating = formatRating;
}
`
  );
  host.write(
    'libs/store/feature-game-detail/src/lib/game-detail/game-detail.component.html',
    `<mat-card *ngIf="game$ | async as game">
<mat-card-header>
  <mat-card-title>
      {{ game.name }}
  </mat-card-title>
</mat-card-header>
<mat-card-content class="content">
  <img
    class="game-image"
    src="{{ game.image }}"
    alt="Picture of board game {{ game.name }}"
  />
  <div class="details">
    <p>{{ game.description }}</p>
    <div class="sell-info">
      <span
        ><span style="font-weight: bold">Price:</span>
        {{ game.price | currency: 'USD' }}</span
      >
      <span>
        <span style="font-weight: bold">Rating:</span>
        {{ formatRating(game.rating) }}
      </span>
    </div>
    <div>
      <button mat-raised-button class="buy-button">BUY</button>
      <button mat-raised-button>SHARE</button>
    </div>
  </div>
</mat-card-content>
</mat-card>
`
  );
  // Add MatButtonModule to StoreFeatureGameDetailModule imports
  const storeFeatureGameDetailModulePath =
    'libs/store/feature-game-detail/src/lib/store-feature-game-detail.module.ts';
  insertNgModuleImport(
    host,
    storeFeatureGameDetailModulePath,
    'MatButtonModule'
  );
  insertImport(
    host,
    storeFeatureGameDetailModulePath,
    'MatButtonModule',
    '@angular/material/button'
  );

  await formatFiles(host);
}
