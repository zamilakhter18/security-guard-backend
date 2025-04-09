import { Test, TestingModule } from '@nestjs/testing';
import { CompanyGuardService } from './company-guard.service';

describe('CompanyGuardService', () => {
  let service: CompanyGuardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompanyGuardService],
    }).compile();

    service = module.get<CompanyGuardService>(CompanyGuardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
