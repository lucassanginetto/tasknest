import { createZodDto } from 'nestjs-zod'
import z from 'zod'

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8)
})

export class LoginDto extends createZodDto(loginSchema) { }
