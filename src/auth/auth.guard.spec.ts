import {
  Controller,
  Get,
  UseGuards,
  Module,
  INestApplication,
} from '@nestjs/common';
import { AuthGuard, JwtPayload } from './auth.guard';
import { App } from 'supertest/types';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { JwtService } from '@nestjs/jwt';

@Controller()
@UseGuards(AuthGuard)
class TestController {
  @Get('/guarded')
  public protectedEndpoint() {
    return 'success';
  }
}

const mockPayload: JwtPayload = {
  sub: 1,
  username: 'username',
  iat: 1234567890,
  exp: 9999999999,
};
const mockJwtService = {
  verifyAsync: jest.fn((token: string) => {
    if (token === 'valid.jwt.token') return mockPayload;
    throw new Error('invalid token');
  }),
} as unknown as jest.Mocked<JwtService>;

@Module({
  controllers: [TestController],
  providers: [
    AuthGuard,
    {
      provide: JwtService,
      useValue: mockJwtService,
    },
  ],
})
class TestModuleForGuard {}

describe('AuthGuard', () => {
  let testApp: INestApplication<App>;

  beforeAll(async () => {
    const testingModule = Test.createTestingModule({
      imports: [TestModuleForGuard],
    }).compile();

    testApp = (await testingModule).createNestApplication();
    await testApp.init();
  });

  afterAll(async () => {
    await testApp.close();
  });

  it('should be defined', () => {
    expect(new AuthGuard(mockJwtService)).toBeDefined();
  });

  it('should allow requests with a valid token', async () => {
    await request(testApp.getHttpServer())
      .get('/guarded')
      .set('Authorization', 'Bearer valid.jwt.token')
      .expect(200)
      .expect('success');
  });

  it("shouldn't allow requests without a token", async () => {
    await request(testApp.getHttpServer()).get('/guarded').expect(401);
  });

  it("should't allow requests with an invalid token", async () => {
    await request(testApp.getHttpServer())
      .get('/guarded')
      .set('Authorization', 'Bearer invalid.jwt.token')
      .expect(401);
  });
});
