import { Injectable } from '@nestjs/common';
import { isEmpty } from '@nestjs/common/utils/shared.utils';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';
import { TokenTypeEnum } from './enums/TokenTypeEnum';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public sign(payload: any, options?: JwtSignOptions) {
    return this.jwtService.signAsync(payload, options);
  }

  public verify(token: string, options?: JwtVerifyOptions) {
    return this.jwtService.verifyAsync(token, options);
  }

  public decode(token: string) {
    return this.jwtService.decode(token);
  }

  public verifyAdmin(user: string, password: string): boolean {
    const adminUsers = [{ user: 'admin', password: 'admin' }];
    const existedUser = isEmpty(adminUsers)
      ? adminUsers
      : (adminUsers as Array<any>).find((x) => x.user === user);

    return existedUser && existedUser.password === password;
  }

  getJwtSignedOptions(type: TokenTypeEnum): JwtSignOptions {
    const jwtTokenSecretKey = this.configService.get<string>('AUTH_SECRET');
    const jwtTokenExpire = this.configService.get<number>(
      'JWT_EXPIRATION_TIME_SECONDS',
    );
    const jwtRefreshTokenSecretKey = this.configService.get<string>(
      'JWT_REFRESH_TOKEN_SECRET',
    );
    const jwtRefreshTokenExpire = this.configService.get<number>(
      'JWT_REFRESH_EXPIRATION_TIME_SECONDS',
    );

    if (type === TokenTypeEnum.AccessToken) {
      return {
        secret: jwtTokenSecretKey,
        expiresIn: jwtTokenExpire,
      };
    } else {
      return {
        secret: jwtRefreshTokenSecretKey,
        expiresIn: jwtRefreshTokenExpire,
      };
    }
  }
}
