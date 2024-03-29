import { Injectable } from '@nestjs/common';
import { DegreesRepository } from './degrees.repository';
import { CreateDegreeDto } from './dto/create-degree.dto';
import { FilterDegreeDto } from './dto/filter-degree.dto';
import { UpdateDegreeDto } from './dto/update-degree.dto';

@Injectable()
export class DegreesService {
  constructor(private degreesRepository: DegreesRepository) {}

  create(createDegreeDto: CreateDegreeDto) {
    return 'This action adds a new degree';
  }

  findAll(filterDegreeDto?: FilterDegreeDto) {
    return this.degreesRepository.findAll(filterDegreeDto);
  }

  findOne(id: number) {
    return `This action returns a #${id} degree`;
  }

  update(id: number, updateDegreeDto: UpdateDegreeDto) {
    return `This action updates a #${id} degree`;
  }

  remove(id: number) {
    return `This action removes a #${id} degree`;
  }
}
