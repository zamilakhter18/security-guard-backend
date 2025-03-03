import { Test, TestingModule } from '@nestjs/testing';
import { IndividualService } from './individual.service';

describe('IndividualService', () => {
  let service: IndividualService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IndividualService],
    }).compile();

    service = module.get<IndividualService>(IndividualService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
