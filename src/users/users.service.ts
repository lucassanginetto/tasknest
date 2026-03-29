import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { FindUserDto } from './dto/find-user.dto';

@Injectable()
export class UsersService {
  private readonly users: User[] = [];
  private nextId: number = 1;

  create(createUserDto: CreateUserDto) {
    const newUser = new User(
      this.nextId,
      createUserDto.username,
      createUserDto.email,
      createUserDto.password,
    );

    this.nextId++;
    this.users.push(newUser);

    return FindUserDto.fromUser(newUser);
  }

  findAll(): FindUserDto[] {
    return this.users.map(FindUserDto.fromUser);
  }

  findOne(id: number): FindUserDto | undefined {
    const user = this.users.find((user) => {
      return user.id == id;
    });

    if (user === undefined) return undefined;

    return FindUserDto.fromUser(user);
  }

  update(id: number, updateUserDto: UpdateUserDto): FindUserDto | undefined {
    const userIndex = this.users.findIndex((user) => {
      return user.id == id;
    });

    if (userIndex == -1) return undefined;

    if (updateUserDto.username !== undefined) {
      this.users[userIndex].username = updateUserDto.username;
    }
    if (updateUserDto.email !== undefined) {
      this.users[userIndex].email = updateUserDto.email;
    }
    if (updateUserDto.password !== undefined) {
      this.users[userIndex].password = updateUserDto.password;
    }

    return FindUserDto.fromUser(this.users[userIndex]);
  }

  replace(id: number, createUserDto: CreateUserDto): FindUserDto | undefined {
    const userIndex = this.users.findIndex((user) => {
      return user.id == id;
    });

    if (userIndex == -1) return undefined;

    this.users[userIndex] = new User(
      id,
      createUserDto.username,
      createUserDto.email,
      createUserDto.password,
    );

    return FindUserDto.fromUser(this.users[userIndex]);
  }

  remove(id: number): boolean {
    const userIndex = this.users.findIndex((user) => {
      return user.id == id;
    });

    if (userIndex == -1) return false;

    this.users.splice(userIndex, 1);
    return true;
  }
}
