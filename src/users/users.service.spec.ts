import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersService', () => {
  let service: UsersService;

  const mockUsersRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        username: 'username',
        password: 'password',
      };

      const mockUser = {
        id: 1,
        createdAt: new Date(),
      } as User;

      jest.spyOn(mockUsersRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(mockUsersRepository, 'create').mockReturnValue(mockUser);
      jest
        .spyOn(mockUsersRepository, 'save')
        .mockImplementation((user: User) => user);

      expect(await service.create(createUserDto)).toEqual({
        id: mockUser.id,
        username: createUserDto.username,
        password: expect.any(String) as string, // TODO: mock bcrypt and check password
        createdAt: mockUser.createdAt,
        tasks: [],
      });
      expect(mockUsersRepository.save).toHaveBeenCalled();
    });

    it('should return USERNAME_ALREADY_TAKEN when username exists', async () => {
      const createUserDto: CreateUserDto = {
        username: 'existingusername',
        password: 'password',
      };

      jest.spyOn(mockUsersRepository, 'findOne').mockResolvedValue({
        id: 1,
        username: createUserDto.username,
        password: 'hashed_password_10',
        createdAt: new Date(),
        tasks: [],
      });

      expect(await service.create(createUserDto)).toBe(
        'USERNAME_ALREADY_TAKEN',
      );
      expect(mockUsersRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
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

      jest.spyOn(mockUsersRepository, 'find').mockResolvedValue(mockUsers);

      expect(await service.findAll()).toEqual(mockUsers);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const mockUser: User = {
        id: 1,
        username: 'username',
        password: 'hashed_password_10',
        createdAt: new Date(),
        tasks: [],
      };

      jest.spyOn(mockUsersRepository, 'findOneBy').mockResolvedValue(mockUser);

      expect(await service.findOne(1));
    });

    it('should return null if user not found', async () => {
      jest.spyOn(mockUsersRepository, 'findOneBy').mockResolvedValue(null);

      expect(await service.findOne(999)).toBeNull();
    });
  });

  describe('findOneByUsername', () => {
    it('should return a user by username', async () => {
      const mockUser: User = {
        id: 1,
        username: 'username',
        password: 'hashed_password_10',
        createdAt: new Date(),
        tasks: [],
      };

      jest.spyOn(mockUsersRepository, 'findOne').mockResolvedValue(mockUser);

      expect(await service.findOneByUsername('username')).toEqual(mockUser);
      expect(mockUsersRepository.findOne).toHaveBeenCalledWith({
        where: [{ username: 'username' }],
      });
    });

    it('should return null if user not found', async () => {
      jest.spyOn(mockUsersRepository, 'findOne').mockResolvedValue(null);

      expect(await service.findOneByUsername('nonexistent')).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = { username: 'newusername' };
      const existingUser: User = {
        id: 1,
        username: 'oldusername',
        password: 'hashed_password_10',
        createdAt: new Date(),
        tasks: [],
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(existingUser);
      jest.spyOn(mockUsersRepository, 'save').mockResolvedValue(existingUser);

      expect(await service.update(1, updateUserDto)).toEqual(existingUser);
      expect(existingUser.username).toBe('newusername');
      expect(mockUsersRepository.save).toHaveBeenCalledWith(existingUser);
    });

    it('should return USER_NOT_FOUND when user does not exist', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      expect(await service.update(999, { username: 'username' })).toBe(
        'USER_NOT_FOUND',
      );
    });

    it('should return USERNAME_ALREADY_TAKEN when new username exists', async () => {
      const updateUserDto: UpdateUserDto = { username: 'existingusername' };

      const existingUser: User = {
        id: 1,
        username: 'oldusername',
        password: 'hashed_password1_10',
        createdAt: new Date(),
        tasks: [],
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(existingUser);
      jest.spyOn(mockUsersRepository, 'findOne').mockResolvedValue({
        id: 2,
        username: 'existinguserusername',
        password: 'hashed_password2_10',
        createdAt: new Date(),
        tasks: [],
      } as User);

      expect(await service.update(1, updateUserDto)).toBe(
        'USERNAME_ALREADY_TAKEN',
      );
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue({
        id: 1,
        username: 'username',
        password: 'hashed_password_10',
        createdAt: new Date(),
        tasks: [],
      } as User);

      expect(await service.remove(1)).toBe(true);
      expect(mockUsersRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should return false when user does not exist', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      expect(await service.remove(999)).toBe(false);
    });
  });
});
