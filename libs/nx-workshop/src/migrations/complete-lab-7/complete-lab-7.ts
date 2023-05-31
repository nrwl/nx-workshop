/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  addDependenciesToPackageJson,
  formatFiles,
  Tree,
  updateJson,
} from '@nx/devkit';
import { applicationGenerator } from '@nx/nest';
import { dependencies } from '../../../package.json';

export default async function update(host: Tree) {
  await addDependenciesToPackageJson(
    host,
    {},
    {
      '@nx/nest': dependencies['@nx/nest'],
    }
  );

  // nx generate @nx/nest:application api --frontendProject=store
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
    json['/api'].target = 'http://localhost:3000';
    return json;
  });
  host.write(
    'apps/api-e2e/src/api/api.spec.ts',
    `import axios from 'axios';
    import { exec } from 'child_process';
    
    describe('GET /api/games', () => {
      it('should return a list of games', async () => {
        exec('nx serve api');
        const res = await axios.get(\`/api/games\`);
    
        expect(res.status).toBe(200);
        expect(res.data).toMatchObject([
          {
            description:
              'Help your bug family claim the best real estate in a spilled can of beans.',
            id: 'settlers-in-the-can',
            image: '/assets/beans.png',
            name: 'Settlers in the Can',
            price: 35,
          },
          {
            description: 'A circular game of Chess that you can eat as you play.',
            id: 'chess-pie',
            image: '/assets/chess.png',
            name: 'Chess Pie',
            price: 15,
          },
          {
            description: 'A cat grooming contest goes horribly wrong.',
            id: 'purrfection',
            image: '/assets/cat.png',
            name: 'Purrfection',
            price: 45,
          },
        ]);
      });
    });
    `
  );

  await formatFiles(host);
}
