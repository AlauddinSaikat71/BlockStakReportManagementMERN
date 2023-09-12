import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    return true;

    const requireRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    if (!requireRoles) {
      return true;
    }

    const request: Request = context.switchToHttp().getRequest();

    const authorizationHeaderValue = request.headers['authorization'];
    if (
      authorizationHeaderValue === null ||
      authorizationHeaderValue === undefined
    ) {
      throw new UnauthorizedException('authorization header is missing');
    }

    let token = authorizationHeaderValue.replace('bearer ', '');
    token = authorizationHeaderValue.replace('Bearer ', '');

    const correlationId = uuidv4();

    const jwtTokenSecretKey =
      this.configService.get<string>('JWT_TOKEN_SECRET');

    try {
      const response = await this.jwtService.verifyAsync(token, {
        secret: jwtTokenSecretKey,
      });
    } catch (err) {
      throw new UnauthorizedException(`Token is invalid with error: ${err}`);
    }

    const tokenInfo = this.jwtService.decode(token);
    const userRoles = tokenInfo['roles'];

    return requireRoles.some((role) => userRoles.includes(role));
  }
}
