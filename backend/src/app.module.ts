import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { SeedsModule } from './seeds/seeds.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './role/roles.guard';
import { CaslModule } from './casl/casl.module';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { JwtStrategy } from './guard/jwt.strategy';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGO_CONNECTION || 'mongodb://localhost/practice',
      {
        useCreateIndex: true,
      },
    ),
    AuthModule,
    CaslModule,
    UserModule,
    SeedsModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule {}
