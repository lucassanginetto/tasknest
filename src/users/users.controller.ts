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
} from '@nestjs/common';
import type { Response } from 'express';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUserDto } from './dto/find-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const newUser = this.usersService.create(createUserDto);

    res.header('Location', `/users/${newUser.id}`);

    return newUser;
  }

  @Get()
  findAll(): FindUserDto[] {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): FindUserDto {
    const user = this.usersService.findOne(id);

    if (user === undefined)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    return user;
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  ): FindUserDto {
    const user = this.usersService.update(id, updateUserDto);

    if (user === undefined)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    return user;
  }

  @Put(':id')
  replace(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): FindUserDto {
    const user = this.usersService.replace(id, createUserDto);

    if (user === undefined)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    return user;
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number) {
    if (!this.usersService.remove(id))
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }
}
