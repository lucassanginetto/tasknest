import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Res, Query, ParseEnumPipe, ParseIntPipe, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuthGuard, JwtPayload } from '../auth/auth.guard';
import type { FastifyReply as Reply } from 'fastify';
import { Status } from '../prisma/generated/enums';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) { }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @JwtPayload() jwtPayload: { id: number },
    @Res({ passthrough: true }) reply: Reply
  ) {
    const task = await this.tasksService.create(jwtPayload.id, createTaskDto)
    reply.header('Location', `/users/${task.id}`)
    return task
  }

  @ApiBearerAuth()
  @ApiQuery({ name: 'status', enum: Status, required: false })
  @UseGuards(AuthGuard)
  @Get()
  findAll(
    @Query('status', new ParseEnumPipe(Status, { optional: true })) status: Status | undefined,
    @JwtPayload() jwtPayload: { id: number },
  ) {
    if (status !== undefined) {
      return this.tasksService.findByStatus(jwtPayload.id, status)
    }
    return this.tasksService.findAll(jwtPayload.id)
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @JwtPayload() jwtPayload: { id: number },
  ) {
    const task = await this.tasksService.findOne(jwtPayload.id, id)
    if (task === null) throw new NotFoundException('Task not found')
    return task
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
    @JwtPayload() jwtPayload: { id: number },
  ) {
    return (await this.tasksService.update(jwtPayload.id, id, updateTaskDto)).match(
      (task) => task,
      (error) => {
        switch (error.kind) {
          case 'TASK_NOT_FOUND':
            throw new NotFoundException('Task not found')
          case 'UNKNOWN_ERROR':
            console.error(error.cause)
            throw new InternalServerErrorException()
        }
      }
    )
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @JwtPayload() jwtPayload: { id: number },
  ) {
    const removeResult = await this.tasksService.remove(jwtPayload.id, id)
    if (removeResult.isErr()) {
      switch (removeResult.error.kind) {
        case 'TASK_NOT_FOUND':
          throw new NotFoundException('Task not found')
        case 'UNKNOWN_ERROR':
          console.error(removeResult.error.cause)
          throw new InternalServerErrorException()
      }
    }
  }
}
