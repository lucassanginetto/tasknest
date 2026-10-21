import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AuthModule } from '../src/auth/auth.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { ZodValidationPipe } from 'nestjs-zod';
import { afterEach, beforeEach, describe, expect, it, jest } from 'bun:test';

describe('AuthController (e2e)', () => {
  let app: INestApplication<App>;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn((_: any) => null),
      create: jest.fn((args: any) => {
        return {
          id: 1,
          name: args.data.name,
          email: args.data.email,
          password: args.data.password,
        }
      })
    }
  }

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .compile();

    app = moduleFixture.createNestApplication()
    app.useGlobalPipes(new ZodValidationPipe())
    await app.init();
  });

  it('/auth/signup (POST) --> 400 on validation error', () => {
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ name: 123, email: '123', password: 123 })
      .expect(400)
  })

  it('/auth/signup (POST)', async () => {
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ name: 'Test', email: 'user@test.com', password: 'testpassword123' })
      .expect(201)
      .then((response) => {
        expect(response.body).toEqual({
          id: expect.any(Number),
          name: 'Test',
          email: 'user@test.com'
        })
      })
  })

  afterEach(async () => {
    await app.close();
  })
})
