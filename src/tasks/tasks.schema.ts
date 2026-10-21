import z from "zod"
import { Status } from "../prisma/generated/enums"

export const taskSchema = z.object({
  id: z.int(),
  title: z.string().nonempty(),
  description: z.string(),
  status: z.enum(Status)
})

export const createTaskSchema = z.object({
  title: z.string().nonempty(),
  description: z.string(),
  status: z.enum(Status)
})

export const updateTaskSchema = createTaskSchema.partial()

export const taskResponseSchema = taskSchema
