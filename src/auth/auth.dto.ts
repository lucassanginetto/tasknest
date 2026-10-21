import { createZodDto } from 'nestjs-zod'
import { jwtResponseSchema, loginSchema, signupSchema, userResponseSchema } from './auth.schema';

export class LoginDto extends createZodDto(loginSchema) { }
export class SignupDto extends createZodDto(signupSchema) { }
export class UserResponseDto extends createZodDto(userResponseSchema) { }
export class JwtResponseDto extends createZodDto(jwtResponseSchema) { }
