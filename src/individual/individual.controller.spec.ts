import { Test, TestingModule } from '@nestjs/testing';
import { IndividualController } from './individual.controller';
import { IndividualService } from './individual.service';

describe('IndividualController', () => {
  let controller: IndividualController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IndividualController],
      providers: [IndividualService],
    }).compile();

    controller = module.get<IndividualController>(IndividualController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
