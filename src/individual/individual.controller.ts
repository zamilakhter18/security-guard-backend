import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { IndividualService } from './individual.service';
import { CreateIndividualDto } from './dto/create-individual.dto';
import { UpdateIndividualDto } from './dto/update-individual.dto';

@Controller('individual')
export class IndividualController {
  constructor(private readonly individualService: IndividualService) {}

  @Post()
  create(@Body() createIndividualDto: CreateIndividualDto) {
    return this.individualService.create(createIndividualDto);
  }

  @Get()
  findAll() {
    return this.individualService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.individualService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateIndividualDto: UpdateIndividualDto) {
    return this.individualService.update(+id, updateIndividualDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.individualService.remove(+id);
  }
}
