import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user/user.service';
import { SeedsService } from './seeds.service';

describe('SeedsService', () => {
  let seedService: SeedsService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeedsService,
        {
          provide: UserService,
          useValue: {
            create: jest.fn().mockImplementation((dto) => {
              const { password, ...info } = dto;
              const createdUserDoc = {
                ...info,
                ...{ id: '60c06c3c648f344e440ced70' },
              };
              return Promise.resolve(createdUserDoc);
            }),
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    seedService = module.get<SeedsService>(SeedsService);
  });

  it('should be defined', () => {
    expect(seedService).toBeDefined();
  });
});
