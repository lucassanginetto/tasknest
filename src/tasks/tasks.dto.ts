import { createZodDto } from "nestjs-zod";
import { createTaskSchema, taskResponseSchema, updateTaskSchema } from "tasknest-schemas";

export class CreateTaskDto extends createZodDto(createTaskSchema) { }
export class UpdateTaskDto extends createZodDto(updateTaskSchema) { }
export class TaskResponseDto extends createZodDto(taskResponseSchema) { }
