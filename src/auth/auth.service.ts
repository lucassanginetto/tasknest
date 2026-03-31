import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { JwtTokenDto } from './auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    username: string,
    password: string,
  ): Promise<JwtTokenDto | 'USER_NOT_FOUND' | 'WRONG_CREDENTIALS'> {
    const user = await this.usersService.findOneByUsername(username);

    if (user === null) return 'USER_NOT_FOUND';

    if (!(await bcrypt.compare(password, user.password)))
      return 'WRONG_CREDENTIALS';

    const payload = { sub: user.id, username: user.username };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
