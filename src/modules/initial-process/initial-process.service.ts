import { Injectable } from '@nestjs/common';
import { CreateInitialProcessDto } from './dto/create-initial-process.dto';
import { UpdateInitialProcessDto } from './dto/update-initial-process.dto';
import { InitialProcessRepository } from './initial-process.repository';

@Injectable()
export class InitialProcessService {
  constructor (private initialProcessRepository: InitialProcessRepository) {}

  create(createInitialProcessDto: CreateInitialProcessDto) {
    return 'This action adds a new initialProcess';
  }

  findAll() {
    return this.initialProcessRepository.findAll();
  }

  findOne(id: number) {
    return `This action returns a #${id} initialProcess`;
  }

  update(id: number, updateInitialProcessDto: UpdateInitialProcessDto) {
    return `This action updates a #${id} initialProcess`;
  }

  remove(id: number) {
    return `This action removes a #${id} initialProcess`;
  }
}
