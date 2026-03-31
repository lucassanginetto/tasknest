import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  private async isUsernameAvailable(username: string): Promise<boolean> {
    const userWithUsername = await this.usersRepository.findOne({
      where: [{ username }],
    });
    if (userWithUsername === null) return true;
    return false;
  }

  async create(
    createUserDto: CreateUserDto,
  ): Promise<User | 'USERNAME_ALREADY_TAKEN'> {
    if (!(await this.isUsernameAvailable(createUserDto.username))) {
      return 'USERNAME_ALREADY_TAKEN';
    }

    const newUser = this.usersRepository.create();

    newUser.username = createUserDto.username;
    newUser.password = await bcrypt.hash(createUserDto.password, 10);

    return this.usersRepository.save(newUser);
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  findOneByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: [{ username }] });
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<User | 'USER_NOT_FOUND' | 'USERNAME_ALREADY_TAKEN'> {
    const user = await this.findOne(id);
    if (user === null) {
      return 'USER_NOT_FOUND';
    }

    if (updateUserDto.username !== undefined) {
      if (!(await this.isUsernameAvailable(updateUserDto.username))) {
        return 'USERNAME_ALREADY_TAKEN';
      }
      user.username = updateUserDto.username;
    }
    if (updateUserDto.password !== undefined) {
      user.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    return this.usersRepository.save(user);
  }

  async replace(
    id: number,
    createUserDto: CreateUserDto,
  ): Promise<User | 'USER_NOT_FOUND' | 'USERNAME_ALREADY_TAKEN'> {
    if (!(await this.isUsernameAvailable(createUserDto.username))) {
      return 'USERNAME_ALREADY_TAKEN';
    }

    const user = await this.findOne(id);
    if (user === null) {
      return 'USER_NOT_FOUND';
    }

    user.username = createUserDto.username;
    user.password = await bcrypt.hash(createUserDto.password, 10);

    return this.usersRepository.save(user);
  }

  async remove(id: number): Promise<boolean> {
    if ((await this.findOne(id)) === null) return false;
    await this.usersRepository.delete(id);
    return true;
  }
}
