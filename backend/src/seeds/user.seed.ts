import { Injectable } from '@nestjs/common';
import { Command, Option, Positional } from 'nestjs-command';
import { SeedsService } from './seeds.service';

@Injectable()
export class UserSeed {
  constructor(private readonly seedsService: SeedsService) {}

  @Command({
    command: 'create:user',
    describe: 'create user',
    autoExit: true,
  })
  async create(
    @Option({
      name: 'amount',
      describe: 'Number of user to seed',
      type: 'number',
      default: 5,
      required: false,
    })
    amount: number,
  ) {
    await this.seedsService.createUser(amount);
  }
}
