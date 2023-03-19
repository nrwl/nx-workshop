/* eslint-disable @typescript-eslint/no-unused-vars */
import { addDependenciesToPackageJson, formatFiles, Tree, updateJson } from '@nrwl/devkit';
import { applicationGenerator } from '@nrwl/nest';
import { dependencies } from '../../../package.json';

export default async function update(host: Tree) {
  await addDependenciesToPackageJson(
    host,
    {},
    {
      '@nrwl/nest': dependencies['@nrwl/nest'],
    }
  );

  // nx generate @nrwl/nest:application api --frontendProject=store
  await applicationGenerator(host, {
    name: 'api',
    frontendProject: 'store',
  });
  host.write(
    'apps/api/src/app/app.service.ts',
    `import { Injectable } from '@nestjs/common';

    const games = [
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

    @Injectable()
    export class AppService {
      getAllGames = () => games;
      getGame = (id: string) => games.find(game => game.id === id);
    }`
  );
  host.write(
    'apps/api/src/app/app.controller.ts',
    `import { Controller, Get, Param } from '@nestjs/common';
    import { AppService } from './app.service';

    @Controller('games')
    export class AppController {
      constructor(private readonly appService: AppService) {}

      @Get()
      getAllGames() {
        return this.appService.getAllGames();
      }

      @Get('/:id')
      getGame(@Param('id') id: string) {
        return this.appService.getGame(id);
      }
    }
    `
  );
  updateJson(host, 'apps/store/proxy.conf.json', (json) => {
    json['/api'].target = 'http://localhost:3333';
    return json;
  });

  await formatFiles(host);
}
