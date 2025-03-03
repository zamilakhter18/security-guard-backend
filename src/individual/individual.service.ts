import { Injectable } from '@nestjs/common';
import { CreateIndividualDto } from './dto/create-individual.dto';
import { UpdateIndividualDto } from './dto/update-individual.dto';

@Injectable()
export class IndividualService {
  create(createIndividualDto: CreateIndividualDto) {
    return 'This action adds a new individual';
  }

  findAll() {
    return `This action returns all individual`;
  }

  findOne(id: number) {
    return `This action returns a #${id} individual`;
  }

  update(id: number, updateIndividualDto: UpdateIndividualDto) {
    return `This action updates a #${id} individual`;
  }

  remove(id: number) {
    return `This action removes a #${id} individual`;
  }
}
