import { Test } from '@nestjs/testing';

import { AppService, games } from './app.service';

describe('AppService', () => {
  let service: AppService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = app.get<AppService>(AppService);
  });

  describe('getAllGames', () => {
    it('should return full game list', () => {
      expect(service.getAllGames()).toEqual(games);
    });
  });

  describe('getGame', () => {
    it('should return game by id', () => {
      expect(service.getGame(games[0].id)).toEqual(games[0]);
    });

    it('should return undefined for unknown ids', () => {
      expect(service.getGame(games[0].id)).toEqual(games[0]);
    });
  });
});
