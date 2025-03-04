import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post('sign-up')
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientService.create(createClientDto);
  }

}
