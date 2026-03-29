import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/users (POST)', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({ username: 'test', email: 'test@test.com', password: 'secret' })
      .expect(201)
      .expect((res) => {
        if (
          JSON.stringify(res.body) !==
          JSON.stringify({
            id: 1,
            username: 'test',
            email: 'test@test.com',
          })
        )
          throw new Error('Expected same user data that was sent');
      });
  });

  it('/users (GET)', () => {
    return request(app.getHttpServer())
      .get('/users')
      .expect(200)
      .expect((res) => {
        if (JSON.stringify(res.body) !== JSON.stringify([]))
          throw new Error('Expected empty array');
      });
  });

  it('/users/:id (GET)', () => {
    return request(app.getHttpServer()).get('/users/1').expect(404);
  });

  it('/users/:id (PUT)', () => {
    return request(app.getHttpServer())
      .put('/users/1')
      .send({ username: 'test', email: 'test@test.com', password: 'secret' })
      .expect(404);
  });

  it('/users/:id (PATCH)', () => {
    return request(app.getHttpServer()).patch('/users/1').expect(404);
  });

  it('/users/:id (DELETE)', () => {
    return request(app.getHttpServer()).delete('/users/1').expect(404);
  });
});
