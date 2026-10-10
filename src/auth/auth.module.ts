import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { jwtConstants } from './constants';
import { BcryptService } from '../bcrypt/bcrypt.service';

@Module({
  imports: [JwtModule.register({
    global: true,
    secret: jwtConstants.SECRET,
    signOptions: { expiresIn: jwtConstants.EXPIRES_IN }
  })],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, BcryptService]
})
export class AuthModule { }
