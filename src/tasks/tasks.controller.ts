import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  HttpException,
  Res,
  ValidationPipe,
  NotFoundException,
  ParseIntPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FindTaskDto } from './dto/find-task.dto';
import { AuthGuard, JwtPayload, User } from 'src/auth/auth.guard';
import type { Response } from 'express';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Body(ValidationPipe) createTaskDto: CreateTaskDto,
    @User() jwtPayload: JwtPayload,
    @Res({ passthrough: true }) res: Response,
  ): Promise<FindTaskDto> {
    const newTask = await this.tasksService.create(
      createTaskDto,
      jwtPayload.sub,
    );

    if (newTask === 'USER_NOT_FOUND') {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    res.header('Location', `/users/${newTask.id}`);

    return FindTaskDto.fromTask(newTask);
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll(@User() jwtPayload: JwtPayload): Promise<FindTaskDto[]> {
    return (await this.tasksService.findAll(jwtPayload.sub)).map(
      FindTaskDto.fromTask,
    );
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @User() jwtPayload: JwtPayload,
  ): Promise<FindTaskDto> {
    const task = await this.tasksService.findOne(id, jwtPayload.sub);
    if (task === null) throw new NotFoundException('Task not found');
    return FindTaskDto.fromTask(task);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
    @User() jwtPayload: JwtPayload,
  ): Promise<FindTaskDto> {
    const task = await this.tasksService.update(
      id,
      updateTaskDto,
      jwtPayload.sub,
    );
    if (task === null) throw new NotFoundException('Task not found');
    return FindTaskDto.fromTask(task);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @User() jwtPayload: JwtPayload,
  ) {
    if (!(await this.tasksService.remove(id, jwtPayload.sub)))
      throw new NotFoundException('Task not found');
  }
}
