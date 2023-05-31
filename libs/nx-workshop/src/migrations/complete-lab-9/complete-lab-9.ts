/* eslint-disable @typescript-eslint/no-unused-vars */
import { formatFiles, Tree } from '@nx/devkit';
import { moveGenerator } from '@nx/workspace';
import { libraryGenerator } from '@nx/js';
import { insertImport } from '@nx/workspace/src/generators/utils/insert-import';
import { replaceInFile } from '../utils';

export default async function update(host: Tree) {
  // nx generate @nx/js:lib util-interface --directory=api
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

  // nx generate @nx/workspace:move --projectName=api-util-interface util-interface
  await moveGenerator(host, {
    projectName: 'api-util-interface',
    destination: 'util-interface',
    updateImportPath: true,
  });
  const appSevicePath = 'apps/api/src/app/app.service.ts';
  insertImport(host, appSevicePath, 'Game', '@bg-hoard/util-interface');
  replaceInFile(
    host,
    appSevicePath,
    `const games = [`,
    `const games: Game[] = [`
  );
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
  host.write(
    'apps/api-e2e/src/api/graph.spec.ts',
    `import { execSync } from 'child_process';
    import { readFileSync } from 'node:fs';
    
    describe('Dependencies', () => {
      it('should have three dependencies on util-interface', async () => {
        execSync('nx graph --file=graph.json');
        const graph = JSON.parse(readFileSync('graph.json').toString());
        expect(graph.graph.dependencies['store'].some(dep => dep.target === 'util-interface')).toBe(true);
        expect(graph.graph.dependencies['store-feature-game-detail'].some(dep => dep.target === 'util-interface')).toBe(true);
        expect(graph.graph.dependencies['api'].some(dep => dep.target === 'util-interface')).toBe(true);
      });
    });
    `
  );
  await formatFiles(host);
}
