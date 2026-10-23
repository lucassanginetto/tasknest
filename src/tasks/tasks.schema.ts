import z from "zod"

export const taskSchema = z.object({
  id: z.int(),
  title: z.string().nonempty(),
  description: z.string(),
  status: z.union([z.literal('TODO'), z.literal('IN_PROGRESS'), z.literal('COMPLETED')])
})

export const createTaskSchema = taskSchema.omit({ id: true })

export const updateTaskSchema = createTaskSchema.partial()

export const taskResponseSchema = taskSchema
