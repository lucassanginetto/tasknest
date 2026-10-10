import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { err, ok } from 'neverthrow';

import { PrismaService } from '../prisma/prisma.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { BcryptService } from '../bcrypt/bcrypt.service';

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService, private jwtService: JwtService, private bcryptService: BcryptService) { }

  async signup(signupDto: SignupDto) {
    if (
      await this.prismaService.user.findUnique({
        where: { email: signupDto.email }
      }) !== null
    ) {
      return err('EMAIL_CONFLICT');
    }

    const hashedPassword = await this.bcryptService.hash(signupDto.password)

    const user = await this.prismaService.user.create({
      data: {
        name: signupDto.name,
        email: signupDto.email,
        password: hashedPassword,
      }
    })

    return ok({
      id: user.id,
      name: user.name,
      email: user.email,
    })
  }

  async login(loginDto: LoginDto) {
    const user = await this.prismaService.user.findUnique({
      where: { email: loginDto.email }
    })

    if (user === null) {
      return err('USER_NOT_FOUND')
    }

    if (!await this.bcryptService.compare(loginDto.password, user.password)) {
      return err('WRONG_PASSWORD')
    }

    return ok({
      accessToken: await this.jwtService.signAsync({
        id: user.id,
        name: user.name,
        email: user.email,
      })
    })
  }
}
