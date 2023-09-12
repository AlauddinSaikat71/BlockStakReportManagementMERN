import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { BasicStrategy as Strategy } from 'passport-http';
import { AuthService } from '../auth.service';
@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy, 'basic') {
  constructor(private authService: AuthService) {
    super();
  }

  public validate(username: string, password: string) {
    const isAdmin = this.authService.verifyAdmin(username, password);
    if (!isAdmin) {
      throw new UnauthorizedException();
    }
    return { user_name: username, role: 'admin' };
  }
}
