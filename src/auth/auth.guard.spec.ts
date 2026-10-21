import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';
import { describe, expect, it } from 'bun:test';

describe('AuthGuard', () => {
  it('should be defined', () => {
    expect(new AuthGuard(new JwtService({ secret: 'test-secret' }))).toBeDefined();
  });
});
