import { Test, TestingModule } from '@nestjs/testing';
import { SeedsService } from './seeds.service';

describe('SeedsService', () => {
  let service: SeedsService;

  // beforeEach(async () => {
  //   const module: TestingModule = await Test.createTestingModule({
  //     // providers: [SeedsService,
  //     // {
  //     //    provide: getRepositoryToken(),
  //     //    useValue: {},
  //     // },
  //     ]}).compile();

  //   service = module.get<SeedsService>(SeedsService);
  // });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
