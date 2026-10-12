import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Status } from '../prisma/generated/enums';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { err, ok } from 'neverthrow';

@Injectable()
export class TasksService {
  constructor(private prismaService: PrismaService) { }

  create(userId: number, createTaskDto: CreateTaskDto) {
    return this.prismaService.task.create({ data: { title: createTaskDto.title, description: createTaskDto.description, status: createTaskDto.status, userId } })
  }

  findAll(userId: number) {
    return this.prismaService.task.findMany({ where: { userId } })
  }

  findByStatus(userId: number, status: Status) {
    return this.prismaService.task.findMany({
      where: {
        userId,
        status
      }
    })
  }

  findOne(userId: number, id: number) {
    return this.prismaService.task.findUnique({
      where: { userId, id }
    })
  }

  async update(userId: number, id: number, updateTaskDto: UpdateTaskDto) {
    try {
      return ok(
        await this.prismaService.task.update({
          where: { userId, id },
          data: { ...updateTaskDto }
        })
      )
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
        return err({ kind: 'TASK_NOT_FOUND' } as const)
      } else {
        return err({ kind: 'UNKNOWN_ERROR', cause: error } as const)
      }
    }
  }

  async remove(userId: number, id: number) {
    try {
      return ok(await this.prismaService.task.delete({ where: { userId, id } }))
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
        return err({ kind: 'TASK_NOT_FOUND' } as const)
      } else {
        return err({ kind: 'UNKNOWN_ERROR', cause: error } as const)
      }
    }
  }
}
