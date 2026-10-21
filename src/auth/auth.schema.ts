import z from "zod";

const userSchema = z.object({
  id: z.int(),
  name: z.string().nonempty(),
  email: z.email(),
  password: z.string().min(8)
})

export const loginSchema = userSchema.omit({
  id: true,
  name: true
})

export const signupSchema = userSchema.omit({
  id: true
})

export const userResponseSchema = userSchema.omit({
  password: true
})

export const jwtResponseSchema = z.object({
  accessToken: z.jwt()
})
