import { Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';

@Injectable()
export class ClientService {
  create(createClientDto: CreateClientDto) {
    return 'This action adds a new client';
  }
}
