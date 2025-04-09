import { Test, TestingModule } from '@nestjs/testing';
import { CompanyGuardController } from './company-guard.controller';
import { CompanyGuardService } from './company-guard.service';

describe('CompanyGuardController', () => {
  let controller: CompanyGuardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyGuardController],
      providers: [CompanyGuardService],
    }).compile();

    controller = module.get<CompanyGuardController>(CompanyGuardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
