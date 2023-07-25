import { Injectable } from '@nestjs/common';
import { CreateManagerDto } from './dto/create-manager.dto';
import { FilterManagerDto } from './dto/filter-manager.dto';
import { UpdateManagerDto } from './dto/update-manager.dto';
import { ManagersRepository } from './managers.repository';

@Injectable()
export class ManagersService {
  constructor(private managersRepository: ManagersRepository) {}

  create(createManagerDto: CreateManagerDto) {
    return 'This action adds a new manager';
  }

  findAll(filterManagerDto?: FilterManagerDto) {
    return this.managersRepository.findAll(filterManagerDto);
  }

  findOne(id: number) {
    return `This action returns a #${id} manager`;
  }

  update(id: number, updateManagerDto: UpdateManagerDto) {
    return `This action updates a #${id} manager`;
  }

  remove(id: number) {
    return `This action removes a #${id} manager`;
  }

  removeByperiod(periodId: string) {
    return this.managersRepository.removeByperiod(periodId);
  }
}
