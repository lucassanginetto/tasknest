import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthGuard, JwtPayload } from 'src/auth/auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { Response } from 'express';
import { FindUserDto } from './dto/find-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUsersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };
  const mockAuthGuard = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    })
      .overrideProvider(UsersService)
      .useValue(mockUsersService)
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user and return it', async () => {
      const createUserDto: CreateUserDto = {
        username: 'username',
        password: 'password',
      };
      const mockUser: User = {
        id: 1,
        username: createUserDto.username,
        password: `hashed_${createUserDto.password}_10`,
        createdAt: new Date(),
        tasks: [],
      };
      const mockResponse = {
        header: jest.fn(),
      } as unknown as Response;

      jest.spyOn(mockUsersService, 'create').mockResolvedValue(mockUser);

      expect(await controller.create(createUserDto, mockResponse)).toEqual({
        id: mockUser.id,
        username: createUserDto.username,
      });
      expect(mockResponse.header).toHaveBeenCalledWith(
        'Location',
        `/users/${mockUser.id}`,
      );
    });

    it('should throw error if username already exists', () => {
      const createUserDto: CreateUserDto = {
        username: 'existingusername',
        password: 'password',
      };
      const mockResponse = {} as unknown as Response;

      jest
        .spyOn(mockUsersService, 'create')
        .mockResolvedValue('USERNAME_ALREADY_TAKEN');

      expect(controller.create(createUserDto, mockResponse)).rejects.toThrow();
    });
  });

  describe('findAll', () => {
    it('should return an array of users', () => {
      const mockUsers: User[] = [
        {
          id: 1,
          username: 'username1',
          password: 'hashed_password1_10',
          createdAt: new Date(),
          tasks: [],
        },
        {
          id: 2,
          username: 'username2',
          password: 'hashed_password2_10',
          createdAt: new Date(),
          tasks: [],
        },
      ];

      jest.spyOn(mockUsersService, 'findAll').mockResolvedValue(mockUsers);

      expect(controller.findAll()).resolves.toEqual([
        {
          id: 1,
          username: 'username1',
        },
        {
          id: 2,
          username: 'username2',
        },
      ] as unknown as FindUserDto[]);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', () => {
      const mockUser: User = {
        id: 1,
        username: 'username',
        password: 'hashed_password_10',
        createdAt: new Date(),
        tasks: [],
      };

      jest.spyOn(mockUsersService, 'findOne').mockResolvedValue(mockUser);

      expect(controller.findOne(1)).resolves.toEqual({
        id: 1,
        username: 'username',
      } as unknown as User);
    });

    it("should throw error if user doesn't exist", () => {
      jest.spyOn(mockUsersService, 'findOne').mockResolvedValue(null);

      expect(controller.findOne(999)).rejects.toThrow();
    });
  });

  describe('update', () => {
    it('should update user', () => {
      const updateUserDto: UpdateUserDto = {
        username: 'newusername',
      };
      const mockUser: User = {
        id: 1,
        username: 'newusername',
        password: 'hashed_password_10',
        createdAt: new Date(),
        tasks: [],
      };

      jest.spyOn(mockUsersService, 'update').mockResolvedValue(mockUser);

      expect(
        controller.update(1, updateUserDto, { sub: 1 } as JwtPayload),
      ).resolves.toEqual({
        id: mockUser.id,
        username: updateUserDto.username,
      } as FindUserDto);
    });

    it("should throw error if user being updated isn't the authenticated user", () => {
      const updateUserDto: UpdateUserDto = {
        username: 'newusername',
      };
      const mockUser: User = {
        id: 1,
        username: 'newusername',
        password: 'hashed_password_10',
        createdAt: new Date(),
        tasks: [],
      };

      jest.spyOn(mockUsersService, 'update').mockResolvedValue(mockUser);

      expect(
        controller.update(1, updateUserDto, { sub: 2 } as JwtPayload),
      ).rejects.toThrow();
    });
  });

  describe('remove', () => {
    it('should remove user', async () => {
      jest.spyOn(mockUsersService, 'remove').mockResolvedValue(true);

      expect(await controller.remove(1, { sub: 1 } as JwtPayload));
    });

    it("should throw error if user being removed isn't the authenticated user", () => {
      expect(controller.remove(1, { sub: 2 } as JwtPayload)).rejects.toThrow();
    });
  });
});
