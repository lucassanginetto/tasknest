import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private tasksRepository: Repository<Task>,
    private usersService: UsersService,
  ) {}

  async create(
    createTaskDto: CreateTaskDto,
    userId: number,
  ): Promise<Task | 'USER_NOT_FOUND'> {
    const user = await this.usersService.findOne(userId);
    if (user === null) return 'USER_NOT_FOUND';

    const newTask = this.tasksRepository.create();

    newTask.title = createTaskDto.title;
    newTask.description = createTaskDto.description;
    if (createTaskDto.status !== undefined) {
      newTask.status = createTaskDto.status;
    }
    newTask.user = user;

    return this.tasksRepository.save(newTask);
  }

  findAll(userId: number): Promise<Task[]> {
    return this.tasksRepository.find({ where: [{ user: { id: userId } }] });
  }

  findOne(id: number, userId: number): Promise<Task | null> {
    return this.tasksRepository.findOne({
      where: [{ id, user: { id: userId } }],
    });
  }

  async update(
    id: number,
    updateTaskDto: UpdateTaskDto,
    userId: number,
  ): Promise<Task | null> {
    const task = await this.findOne(id, userId);
    if (task === null) return null;

    if (updateTaskDto.title !== undefined) task.title = updateTaskDto.title;
    if (updateTaskDto.description !== undefined)
      task.description = updateTaskDto.description;
    if (updateTaskDto.status !== undefined) task.status = updateTaskDto.status;

    return this.tasksRepository.save(task);
  }

  async remove(id: number, userId: number): Promise<boolean> {
    if ((await this.findOne(id, userId)) === null) return false;
    await this.tasksRepository.delete(id);
    return true;
  }
}
