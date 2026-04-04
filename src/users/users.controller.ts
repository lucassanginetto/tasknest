import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  ParseIntPipe,
  HttpException,
  HttpStatus,
  HttpCode,
  Res,
  Put,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import type { Response } from 'express';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUserDto } from './dto/find-user.dto';
import { AuthGuard, JwtPayload, User } from '../auth/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<FindUserDto> {
    const newUser = await this.usersService.create(createUserDto);

    if (newUser === 'USERNAME_ALREADY_TAKEN')
      throw new HttpException(
        `Username ${createUserDto.username} already exists`,
        HttpStatus.CONFLICT,
      );

    res.header('Location', `/users/${newUser.id}`);

    return FindUserDto.fromUser(newUser);
  }

  @Get()
  async findAll(): Promise<FindUserDto[]> {
    return (await this.usersService.findAll()).map(FindUserDto.fromUser);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<FindUserDto> {
    const user = await this.usersService.findOne(id);

    if (user === null)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    return FindUserDto.fromUser(user);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
    @User() jwtPayload: JwtPayload,
  ): Promise<FindUserDto> {
    if (jwtPayload.sub !== id) throw new ForbiddenException();

    const user = await this.usersService.update(id, updateUserDto);

    if (user === 'USER_NOT_FOUND')
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    if (user === 'USERNAME_ALREADY_TAKEN')
      throw new HttpException(
        `Username ${updateUserDto.username} already exists`,
        HttpStatus.CONFLICT,
      );

    return FindUserDto.fromUser(user);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Put(':id')
  async replace(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) createUserDto: CreateUserDto,
    @User() jwtPayload: JwtPayload,
  ): Promise<FindUserDto> {
    if (jwtPayload.sub !== id) throw new ForbiddenException();

    const user = await this.usersService.replace(id, createUserDto);

    if (user === 'USER_NOT_FOUND')
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    if (user === 'USERNAME_ALREADY_TAKEN')
      throw new HttpException(
        `Username ${createUserDto.username} already exists`,
        HttpStatus.CONFLICT,
      );

    return FindUserDto.fromUser(user);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @User() jwtPayload: JwtPayload,
  ) {
    if (jwtPayload.sub !== id) throw new ForbiddenException();

    if (!(await this.usersService.remove(id)))
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }
}
