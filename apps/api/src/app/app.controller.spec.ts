import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from './app.controller';
import { AppService, games } from './app.service';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();
  });

  describe('getAllGames', () => {
    it('should return full game list', () => {
      const appController = app.get<AppController>(AppController);
      expect(appController.getAllGames()).toEqual(games);
    });
  });

  describe('getGameById', () => {
    it('should return game by id', () => {
      const appController = app.get<AppController>(AppController);
      expect(appController.getGameById(games[0].id)).toEqual(games[0]);
    });
  });
});
