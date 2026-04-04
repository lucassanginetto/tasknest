import { User } from '../entities/user.entity';

export class FindUserDto {
  public id: number;
  public username: string;

  constructor(id: number, username: string) {
    this.id = id;
    this.username = username;
  }

  static fromUser(this: void, user: User): FindUserDto {
    return new FindUserDto(user.id, user.username);
  }
}
