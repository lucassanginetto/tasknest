import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  UnauthorizedException,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard, JwtPayload, User } from './auth.guard';
import { JwtTokenDto, SignInDto } from './auth.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(
    @Body(ValidationPipe) signInDto: SignInDto,
  ): Promise<JwtTokenDto> {
    const jwtTokenDto = await this.authService.signIn(
      signInDto.username,
      signInDto.password,
    );

    if (jwtTokenDto === 'USER_NOT_FOUND')
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    if (jwtTokenDto === 'WRONG_CREDENTIALS') throw new UnauthorizedException();

    return jwtTokenDto;
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@User() jwtPayload: JwtPayload) {
    return jwtPayload;
  }
}
