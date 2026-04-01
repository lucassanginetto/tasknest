import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { TaskStatus } from '../entities/task.entity';

export class CreateTaskDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status: TaskStatus | undefined;
}
