import { createZodDto } from "nestjs-zod"
import z from "zod"

const signupSchema = z.object({
  name: z.string().nonempty().max(100),
  email: z.email(),
  password: z.string().min(8)
})

export class SignupDto extends createZodDto(signupSchema) { }
