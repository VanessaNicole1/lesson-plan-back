import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePeriodDto } from './dto/create-period.dto';
import { UpdatePeriodDto } from './dto/update-period.dto';
import { PeriodsRepository } from './periods.repository';

@Injectable()
export class PeriodsService {
  constructor(private periodsRepository: PeriodsRepository) {}

  create(createPeriodDto: CreatePeriodDto) {
    return 'This action adds a new period';
  }

  findAll() {
    return this.periodsRepository.findAll();
  }

  findOne(id: number) {
    return `This action returns a #${id} period`;
  }

  update(id: number, updatePeriodDto: UpdatePeriodDto) {
    return `This action updates a #${id} period`;
  }

  remove(id: number) {
    return `This action removes a #${id} period`;
  }

  validateDates(createPeriodDto: CreatePeriodDto) {
    const { startDate, endDate } = createPeriodDto; 

    if (endDate <= startDate) {
      throw new BadRequestException('La fecha de fin del periodo debe ser mayor a la fecha de inicio')
    }
  }
}
