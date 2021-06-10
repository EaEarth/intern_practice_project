import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { SeedsModule } from './seeds/seeds.module';
import { AuthModule } from './auth/auth.module';
import { CaslModule } from './casl/casl.module';
import { JwtStrategy } from './guard/jwt.strategy';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import * as path from 'path';
import 'winston-daily-rotate-file';
import { LoggerConfig } from './config/logging.config';

const logger: LoggerConfig = new LoggerConfig();
@Module({
  imports: [
    WinstonModule.forRoot(logger.getOption()),
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
