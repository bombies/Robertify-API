import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../route/auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(_: string, password: string): Promise<any> {
    const user = this.authService.validateMasterPassword(password);
    if (!user) throw new UnauthorizedException('Invalid password');
    return user;
  }
}
