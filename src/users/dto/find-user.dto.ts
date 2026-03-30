import { User } from '../entities/user.entity';

export class FindUserDto {
  constructor(
    public id: number,
    public username: string,
  ) {}

  static fromUser(this: void, user: User): FindUserDto {
    return new FindUserDto(user.id, user.username);
  }
}
