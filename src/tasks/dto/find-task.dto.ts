import { Task, TaskStatus } from '../entities/task.entity';

export class FindTaskDto {
  constructor(
    public id: number,
    public title: string,
    public description: string,
    public status: TaskStatus,
  ) {}

  static fromTask(this: void, task: Task): FindTaskDto {
    return new FindTaskDto(task.id, task.title, task.description, task.status);
  }
}
