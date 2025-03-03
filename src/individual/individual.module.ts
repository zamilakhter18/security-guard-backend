import { Module } from '@nestjs/common';
import { IndividualService } from './individual.service';
import { IndividualController } from './individual.controller';

@Module({
  controllers: [IndividualController],
  providers: [IndividualService],
})
export class IndividualModule {}
