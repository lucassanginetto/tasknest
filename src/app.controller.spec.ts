import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { beforeEach, describe, expect, it } from 'bun:test';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('status', () => {
    it('should return a timestamp and status', () => {
      expect(appController.status()).toEqual({
        applicationStatus: "Running",
        currentTime: expect.any(Date),
      });
    });
  });
});
