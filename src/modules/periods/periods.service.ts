import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePeriodDto } from './dto/create-period.dto';
import { FilterPeriodDto } from './dto/filter-period.dto';
import { UpdatePeriodDto } from './dto/update-period.dto';
import { PeriodsRepository } from './periods.repository';
import { I18nContext } from 'nestjs-i18n';

@Injectable()
export class PeriodsService {

  readonly baseI18nKey = 'periods.service';

  constructor(private periodsRepository: PeriodsRepository) {}

  create(createPeriodDto: CreatePeriodDto) {
    return 'This action adds a new period';
  }

  findAll(filterPeriodDto?: FilterPeriodDto) {
    return this.periodsRepository.findAll(filterPeriodDto);
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

  validateDates(createPeriodDto: CreatePeriodDto, i18nContext: I18nContext) {
    const { startDate, endDate } = createPeriodDto;

    if (endDate <= startDate) {
      throw new BadRequestException(
        i18nContext.t(`${this.baseI18nKey}.validateDates.GREATER_END_DATE`)
      );
    }
  }
}
