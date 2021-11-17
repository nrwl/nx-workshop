/* eslint-disable @typescript-eslint/no-unused-vars */
import { Tree } from '@nrwl/devkit';
import { libraryGenerator, moveGenerator } from '@nrwl/workspace';
import { insertImport } from '@nrwl/workspace/src/generators/utils/insert-import';
import { replaceInFile } from '../utils';

export default async function update(host: Tree) {
  // nx generate @nrwl/workspace:lib util-interface --directory=api
  await libraryGenerator(host, {
    name: 'util-interface',
    directory: 'api',
  });
  host.write(
    'libs/api/util-interface/src/lib/api-util-interface.ts',
    `export interface Game {
  id: string;
  name: string;
  image: string;
  description: string;
  price: number;
  rating: number;
}
`
  );
  const appSevicePath = 'apps/api/src/app/app.service.ts';
  insertImport(host, appSevicePath, 'Game', '@bg-hoard/api/util-interface');
  replaceInFile(
    host,
    appSevicePath,
    `const games = [`,
    `const games: Game[] = [`
  );

  // nx generate @nrwl/workspace:move --projectName=api-util-interface util-interface
  await moveGenerator(host, {
    projectName: 'api-util-interface',
    destination: 'util-interface',
    updateImportPath: true,
  });
  const appComponentPath = 'apps/store/src/app/app.component.ts';
  insertImport(host, appComponentPath, 'Game', '@bg-hoard/util-interface');
  replaceInFile(
    host,
    appComponentPath,
    'this.http.get<any[]>',
    'this.http.get<Game[]>'
  );

  const gameDetailComponentPath =
    'libs/store/feature-game-detail/src/lib/game-detail/game-detail.component.ts';
  insertImport(
    host,
    gameDetailComponentPath,
    'Game',
    '@bg-hoard/util-interface'
  );
  replaceInFile(
    host,
    gameDetailComponentPath,
    'this.http.get<any>(`/api/games/${id}`);',
    'this.http.get<Game>(`/api/games/${id}`);'
  );
}
