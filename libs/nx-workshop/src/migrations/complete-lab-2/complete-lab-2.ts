/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  addDependenciesToPackageJson,
  formatFiles,
  installPackagesTask,
  Tree,
} from '@nrwl/devkit';
import { nxVersion } from '../version';
import { applicationGenerator } from '@nrwl/angular/generators';
import {
  addImportToModule,
  getTsSourceFile,
} from '@nrwl/angular/src/utils/nx-devkit/ast-utils';
import fetch from 'node-fetch';
import { insertImport } from '@nrwl/workspace/src/generators/utils/insert-import';

export default async function update(tree: Tree) {
  await addDependenciesToPackageJson(
    tree,
    {
      '@angular/cdk': '^12.2.0',
      '@angular/material': '^12.2.0',
    },
    {
      '@nrwl/angular': nxVersion,
    }
  );
  await applicationGenerator(tree, {
    name: 'store',
    routing: true,
  });
  tree.write(
    'apps/store/src/fake-api.ts',
    `const games = [
    {
      id: 'settlers-in-the-can',
      name: 'Settlers in the Can',
      image: '/assets/beans.png', // 'https://media.giphy.com/media/xUNda3pLJEsg4Nedji/giphy.gif',
      description:
        'Help your bug family claim the best real estate in a spilled can of beans.',
      price: 35,
      rating: Math.random()
    },
    {
      id: 'chess-pie',
      name: 'Chess Pie',
      image: '/assets/chess.png', // 'https://media.giphy.com/media/iCZyBnPBLr0dy/giphy.gif',
      description: 'A circular game of Chess that you can eat as you play.',
      price: 15,
      rating: Math.random()
    },
    {
      id: 'purrfection',
      name: 'Purrfection',
      image: '/assets/cat.png', // 'https://media.giphy.com/media/12xMvwvQXJNx0k/giphy.gif',
      description: 'A cat grooming contest goes horribly wrong.',
      price: 45,
      rating: Math.random()
    }
  ];

  export const getAllGames = () => games;
  export const getGame = (id: string) => games.find(game => game.id === id);
  `
  );
  tree.write(
    'apps/store/src/app/app.component.html',
    `<div class="container">
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
    'apps/store/src/app/app.component.css',
    `.games-layout {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
    }

    .container {
      max-width: 800px;
      margin: 50px auto;
    }

    .game-card {
      max-width: 205px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .game-card:hover {
      box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.3);
      transform: translate3d(0, -2px, 0);
      cursor: pointer;
    }
    .game-card:focus {
      outline: none;
    }

    .center-content {
      display: flex;
      justify-content: center;
    }

    .game-details {
      display: flex;
      flex-direction: column;
      margin: 0;
    }
  `
  );
  tree.write(
    'apps/store/src/app/app.component.ts',
    `import { Component } from '@angular/core';
    import { getAllGames } from '../fake-api';

    @Component({
      selector: 'bg-hoard-root',
      templateUrl: './app.component.html',
      styleUrls: ['./app.component.css']
    })
    export class AppComponent {
      title = 'Board Game Hoard';
      games = getAllGames();
    }`
  );

  // Add MatCardModule to AppModule imports
  const modulePath = 'apps/store/src/app/app.module.ts';
  let sourceFile = getTsSourceFile(tree, modulePath);
  sourceFile = addImportToModule(tree, sourceFile, modulePath, 'MatCardModule');
  insertImport(tree, modulePath, 'MatCardModule', '@angular/material/card');

  formatFiles(tree);
  async function download(uri: string, filename: string) {
    await fetch(uri)
      .then(async (res) => Buffer.from(await res.arrayBuffer()))
      .then((buffer) => {
        tree.write(filename, buffer);
      });
  }
  await download(
    'https://github.com/nrwl/nx-react-workshop/raw/main/examples/lab2/apps/store/src/assets/beans.png',
    'apps/store/src/assets/beans.png'
  );
  await download(
    'https://github.com/nrwl/nx-react-workshop/raw/main/examples/lab2/apps/store/src/assets/cat.png',
    'apps/store/src/assets/cat.png'
  );
  await download(
    'https://github.com/nrwl/nx-react-workshop/raw/main/examples/lab2/apps/store/src/assets/chess.png',
    'apps/store/src/assets/chess.png'
  );
  return async () => {
    installPackagesTask(tree);
  };
}
