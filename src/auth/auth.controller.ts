import { Body, ConflictException, Controller, Get, Post, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { AuthGuard, JwtPayload } from './auth.guard';
import { ZodResponse } from 'nestjs-zod';
import { JwtResponseDto, LoginDto, SignupDto, UserResponseDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('signup')
  @ZodResponse({ type: UserResponseDto })
  async signup(@Body() signupDto: SignupDto) {
    const signupResult = await this.authService.signup(signupDto)

    if (signupResult.isErr()) {
      throw new ConflictException('An account with this email address already exists.')
    }
    return signupResult.value
  }

  @Post('login')
  @ZodResponse({ type: JwtResponseDto })
  async login(@Body() loginDto: LoginDto) {
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
