import { Injectable } from '@nestjs/common';
import { SchedulessRepository } from './schedules.repository';

@Injectable()
export class SchedulesService {
  constructor(
    private schedulessRepository: SchedulessRepository,
  ) {}

  findAll() {
    return this.schedulessRepository.findAll();
  }

  findOne(id: string) {
    return this.schedulessRepository.findOne(id);
  }
}
