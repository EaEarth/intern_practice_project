import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as faker from 'faker';
import { Command } from 'nestjs-command';

@Injectable()
export class SeedsService {
  constructor(private readonly userService: UserService) {}

  // use "npx nestjs-command <command>" to run seeding
  @Command({
    command: 'create:all',
    describe: 'seeding all collection to database',
    autoExit: true,
  })
  async seedAll() {
    await this.createUser(5);
  }

  async createUser(amount: number) {
    for (let i = 0; i < amount; ++i) {
      const mockInfo = {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        mobile: faker.phone.phoneNumberFormat(),
        email: faker.internet.email(),
      };
      await this.userService.create(mockInfo);
    }
  }
}
