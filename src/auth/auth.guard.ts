import { CanActivate, createParamDecorator, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { FastifyRequest as Request } from 'fastify'

import { jwtConstants } from './constants';

interface AuthRequest extends Request {
  jwtPayload: unknown
}

export const JwtPayload = createParamDecorator(
  (_: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<AuthRequest>()
    return request.jwtPayload
  }
)

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) { }

  async canActivate(
    context: ExecutionContext,
  ) {
    const request = context.switchToHttp().getRequest<Request>()

    const token = this.extractTokenFromHeader(request)

    if (token === undefined) {
      throw new UnauthorizedException()
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.SECRET
      });
      (request as AuthRequest).jwtPayload = payload

    } catch {
      throw new UnauthorizedException()
    }

    return true
  }

  private extractTokenFromHeader(request: Request) {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}
