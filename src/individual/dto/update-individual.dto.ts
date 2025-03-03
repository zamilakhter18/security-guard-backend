import { PartialType } from '@nestjs/swagger';
import { CreateIndividualDto } from './create-individual.dto';

export class UpdateIndividualDto extends PartialType(CreateIndividualDto) {}
