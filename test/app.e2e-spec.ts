import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
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
      .send({ username: 'test', password: 'secret' })
      .expect(HttpStatus.CREATED)
      .expect(
        JSON.stringify({
          id: 1,
          username: 'test',
        }),
      );
  });

  it('/users (GET)', () => {
    return request(app.getHttpServer())
      .get('/users')
      .expect(HttpStatus.OK)
      .expect(
        JSON.stringify([
          {
            id: 1,
            username: 'test',
          },
        ]),
      );
  });

  it('/users/:id (GET)', () => {
    return request(app.getHttpServer())
      .get('/users/1')
      .expect(HttpStatus.OK)
      .expect(
        JSON.stringify({
          id: 1,
          username: 'test',
        }),
      );
  });

  it('/users/:id (PUT)', () => {
    return request(app.getHttpServer())
      .put('/users/1')
      .send({ username: 'test2', password: 'secret2' })
      .expect(HttpStatus.OK)
      .expect(
        JSON.stringify({
          id: 1,
          username: 'test2',
        }),
      );
  });

  it('/users/:id (PATCH)', () => {
    return request(app.getHttpServer())
      .patch('/users/1')
      .send({ username: 'test3' })
      .expect(HttpStatus.OK)
      .expect(
        JSON.stringify({
          id: 1,
          username: 'test3',
        }),
      );
  });

  it('/users/:id (DELETE)', () => {
    return request(app.getHttpServer())
      .delete('/users/1')
      .expect(HttpStatus.NO_CONTENT)
      .expect('');
  });
});
