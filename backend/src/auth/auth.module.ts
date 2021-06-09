import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../guard/constants';
import { LocalStrategy } from '../guard/local.strategy';
import { JwtStrategy } from '../guard/jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/role/roles.guard';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '600s' },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
