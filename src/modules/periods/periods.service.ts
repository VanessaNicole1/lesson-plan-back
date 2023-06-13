import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { CreatePeriodDto } from './dto/create-period.dto';
import { FilterPeriodDto } from './dto/filter-period.dto';
import { PeriodsRepository } from './periods.repository';

@Injectable()
export class PeriodsService {
  readonly baseI18nKey = 'periods.service';

  constructor(
    private periodsRepository: PeriodsRepository,
    private i18nService: I18nService,
  ) {}

  findAll(filterPeriodDto?: FilterPeriodDto) {
    return this.periodsRepository.findAll(filterPeriodDto);
  }

  findActivePeriods() {
    return this.periodsRepository.findActivePeriods();
  }

  findManyByPeriodIds(periodIds: string[]) {
    return this.periodsRepository.findByPeriodIds(periodIds);
  }

  async findOne(id: string, i18nContext: I18nContext = undefined) {
    const i18n = i18nContext || this.i18nService;
    const period = await this.periodsRepository.findOne(id);

    if (!period) {
      throw new NotFoundException(
        i18n.t(`${this.baseI18nKey}.findOne.PERIOD_DOES_NOT_EXIST`, {
          args: {
            id,
          },
        }),
      );
    }

    return period;
  }

  remove(id: string) {
    return this.periodsRepository.remove(id);
  }

  validateDates(createPeriodDto: CreatePeriodDto, i18nContext: I18nContext) {
    const { startDate, endDate } = createPeriodDto;

    if (endDate <= startDate) {
      throw new BadRequestException(
        i18nContext.t(`${this.baseI18nKey}.validateDates.GREATER_END_DATE`),
      );
    }
  }
}
