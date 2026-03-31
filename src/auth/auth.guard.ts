import {
  CanActivate,
  createParamDecorator,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

export class JwtPayload {
  sub: number;
  username: string;
  iat: number;
  exp: number;
}

interface RequestWithJwt extends Request {
  jwtPayload: JwtPayload;
}

export const User = createParamDecorator(
  (_: unknown, context: ExecutionContext): JwtPayload => {
    const request = context.switchToHttp().getRequest<RequestWithJwt>();
    return request.jwtPayload;
  },
);

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  private extractTokenFromHeader(request: Request): string | null {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : null;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithJwt>();
    const token = this.extractTokenFromHeader(request);

    if (token === null) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
      request.jwtPayload = payload;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }
}
