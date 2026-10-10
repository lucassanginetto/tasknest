import { Body, ConflictException, Controller, Get, Post, UnauthorizedException, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { AuthGuard, JwtPayload } from './auth.guard';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('signup')
  async signup(@Body(ValidationPipe) signupDto: SignupDto) {
    const signupResult = await this.authService.signup(signupDto)

    if (signupResult.isErr()) {
      throw new ConflictException('An account with this email address already exists.')
    }
    return signupResult.value
  }

  @Post('login')
  async login(@Body(ValidationPipe) loginDto: LoginDto) {
    const loginResult = await this.authService.login(loginDto)

    if (loginResult.isErr()) {
      throw new UnauthorizedException('Invalid credentials')
    }
    return loginResult.value
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('jwt')
  async jwt(@JwtPayload() jwtPayload: unknown) {
    return jwtPayload
  }
}
