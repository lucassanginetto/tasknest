import { createZodDto } from "nestjs-zod";
import z from "zod";
import { Status } from "../../prisma/generated/enums";

export const createTaskSchema = z.object({
  title: z.string().nonempty(),
  description: z.string(),
  status: z.enum(Status)
})

export class CreateTaskDto extends createZodDto(createTaskSchema) { }
