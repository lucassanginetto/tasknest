import { Test, TestingModule } from '@nestjs/testing';
import { jest } from '@jest/globals';
import { err, ok } from 'neverthrow';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { LoginDto, SignupDto } from './auth.dto';

describe('AuthController', () => {
  let controller: AuthController

  const mockAuthService = {
    signup: jest.fn((dto: SignupDto) => {
      if (dto.email === 'alreadyexists@test.com') {
        return err('EMAIL_CONFLICT')
      }
      return ok({
        id: 1,
        name: dto.name,
        email: dto.email,
      })
    }),

    login: jest.fn((dto: LoginDto) => {
      if (dto.email !== 'user@test.com') {
        return err('USER_NOT_FOUND')
      }
      if (dto.password !== 'testpassword123') {
        return err('WRONG_PASSWORD')
      }
      return ok({
        accessToken: 'jwt.access.token'
      })
    })
  }
  const mockAuthGuard = {}

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService]
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile()

    controller = module.get<AuthController>(AuthController);
  })

  it('should be defined', () => {
    expect(controller).toBeDefined();
  })

  describe('signup', () => {
    it('should signup user using service', async () => {
      const dto: SignupDto = {
        name: 'Test',
        email: 'user@test.com',
        password: 'testpassword123'
      }

      await expect(controller.signup(dto))
        .resolves
        .toEqual({
          id: expect.any(Number),
          name: 'Test',
          email: 'user@test.com'
        })

      expect(mockAuthService.signup).toHaveBeenCalledWith(dto)
    })

    it('should throw ConflictException if service returns EMAIL_CONFLICT', async () => {
      const dto: SignupDto = {
        name: 'Test',
        email: 'alreadyexists@test.com',
        password: 'testpassword123'
      }

      await expect(controller.signup(dto))
        .rejects
        .toThrow(ConflictException)

      expect(mockAuthService.signup).toHaveBeenCalledWith(dto)
    })
  })

  describe('login', () => {
    it('should login user using service', async () => {
      const dto: LoginDto = {
        email: 'user@test.com',
        password: 'testpassword123'
      }

      await expect(controller.login(dto))
        .resolves
        .toEqual({
          accessToken: expect.any(String),
        })

      expect(mockAuthService.login).toHaveBeenCalledWith(dto)
    })

    it('should throw UnauthorizedException if email is invalid', async () => {
      const dto: LoginDto = {
        email: 'notuser@test.com',
        password: 'testpassword123'
      }

      await expect(controller.login(dto))
        .rejects
        .toThrow(UnauthorizedException)

      expect(mockAuthService.login).toHaveBeenCalledWith(dto)
    })

    it('should throw UnauthorizedException if password is invalid', async () => {
      const dto: LoginDto = {
        email: 'user@test.com',
        password: 'wrongpassword123'
      }

      await expect(controller.login(dto))
        .rejects
        .toThrow(UnauthorizedException)

      expect(mockAuthService.login).toHaveBeenCalledWith(dto)
    })
  })
})
