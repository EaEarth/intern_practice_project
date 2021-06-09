import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.loginByEmail(email);
    if (!user) throw new NotFoundException('User not found');
    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid login');
    const { password, ...result } = user;
    return result;
  }

  async login(user: any) {
    const payload = {
      email: user._doc.email,
      sub: user._doc._id,
      roles: user._doc.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
