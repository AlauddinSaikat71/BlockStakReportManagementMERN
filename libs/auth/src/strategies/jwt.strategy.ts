import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthConfigService } from '../auth-config.service';
import { UserPayload } from '../user-payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(authConfigService: AuthConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        ExtractJwt.fromUrlQueryParameter('token'),
        ExtractJwt.fromHeader('authorization'),
      ]),
      secretOrKey: authConfigService.privateKey,
      passReqToCallback: false,
    });
  }

  public validate(user): any {
    if (!user) {
      throw new UnauthorizedException('User not authorized', 'unauthorized');
    }
    return new UserPayload(user);
  }
}
