import { Task, TaskStatus } from '../entities/task.entity';

export class FindTaskDto {
  public id: number;
  public title: string;
  public description: string;
  public status: TaskStatus;

  constructor(
    id: number,
    title: string,
    description: string,
    status: TaskStatus,
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.status = status;
  }

  static fromTask(this: void, task: Task): FindTaskDto {
    return new FindTaskDto(task.id, task.title, task.description, task.status);
  }
}
