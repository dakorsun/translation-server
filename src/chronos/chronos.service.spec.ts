import { Test, TestingModule } from '@nestjs/testing';
import { ChronosService } from './chronos.service';

describe('ChronosService', () => {
  let service: ChronosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChronosService],
    }).compile();

    service = module.get<ChronosService>(ChronosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
