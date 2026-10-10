import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { BcryptService } from './bcrypt/bcrypt.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, BcryptService],
})
export class AppModule { }
