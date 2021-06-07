import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { UserModule } from '../user/user.module';
import { UserSeed } from './user.seed';
import { SeedsService } from './seeds.service';

@Module({
  imports: [CommandModule, UserModule],
  providers: [UserSeed, SeedsService],
  exports: [UserSeed, SeedsService],
})
export class SeedsModule {}
