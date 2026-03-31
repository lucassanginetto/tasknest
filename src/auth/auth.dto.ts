import { IsNotEmpty } from 'class-validator';

export class SignInDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;
}

export class JwtTokenDto {
  access_token: string;
}
