import { createTaskSchema } from './create-task.dto';
import { createZodDto } from 'nestjs-zod';

const updateTaskSchema = createTaskSchema.partial()

export class UpdateTaskDto extends createZodDto(updateTaskSchema) { }
