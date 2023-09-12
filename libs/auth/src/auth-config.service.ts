import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  JwtModuleOptions,
  JwtOptionsFactory,
  JwtSignOptions,
} from '@nestjs/jwt';
import { AuthOptionsFactory, IAuthModuleOptions } from '@nestjs/passport';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';
import { TokenTypeEnum } from './enums/TokenTypeEnum';

@Injectable()
export class AuthConfigService
  implements JwtOptionsFactory, AuthOptionsFactory
{
  public readonly publicKey: string;

  public readonly privateKey: string;

  public readonly issuer: string;

  public readonly expiry: string;

  public alg = 'RS256';

  constructor(configService: ConfigService) {
    this.privateKey = this.getKeyOrSecret(configService);
    this.publicKey = this.getKeyOrSecret(configService, 'public');
    this.issuer = configService.get('AUTH_ISSUER', 'oauth');
    this.expiry = '1h';
  }

  public createAuthOptions():
    | IAuthModuleOptions<any>
    | Promise<IAuthModuleOptions<any>> {
    return {
      session: false,
      defaultStrategy: ['jwt', 'basic'],
    };
  }

  public createJwtOptions(): JwtModuleOptions | Promise<JwtModuleOptions> {
    return {
      privateKey: this.privateKey,
      publicKey: this.publicKey,
      signOptions: {
        issuer: this.issuer,
        expiresIn: this.expiry,
        algorithm: this.alg as any,
      },
      verifyOptions: {
        issuer: this.issuer,
        algorithms: ['HS256', 'RS256'],
      },
    };
  }

  private getKeyOrSecret(
    configService: ConfigService,
    keytype: 'private' | 'public' = 'private',
  ): string {
    const type = keytype.toLocaleUpperCase();
    let key = configService.get(`AUTH_${type}_KEY`);

    if (key) {
      return key;
    }

    const keyPath = configService.get(`AUTH_${type}_KEY_PATH`);

    if (keyPath && existsSync(keyPath)) {
      key = readFileSync(resolve(keyPath));
    } else {
      key = configService.get('AUTH_SECRET', 'secret');
      this.alg = 'HS256';
    }

    return key;
  }
}
