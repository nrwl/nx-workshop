/* eslint-disable @typescript-eslint/no-unused-vars */
import { formatFiles, Tree } from '@nrwl/devkit';
import { libraryGenerator } from '@nrwl/workspace';
import { replaceInFile } from '../utils';

export default async function update(host: Tree) {
  // nx generate @nrwl/workspace:lib util-formatters --directory=store
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

  await formatFiles(host);
}
