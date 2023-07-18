import { SubjectsService } from './../subjects/subjects.service';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { CreatePeriodDto } from './dto/create-period.dto';
import { FilterPeriodDto } from './dto/filter-period.dto';
import { PeriodsRepository } from './periods.repository';
import { TeachersService } from '../teachers/teachers.service';
import { Exception } from 'handlebars';

@Injectable()
export class PeriodsService {
  readonly baseI18nKey = 'periods.service';

  constructor(
    private periodsRepository: PeriodsRepository,
    private subjectService: SubjectsService,
    private i18nService: I18nService,
    private teacherService: TeachersService,
  ) {}

  findAll(filterPeriodDto?: FilterPeriodDto) {
    return this.periodsRepository.findAll(filterPeriodDto);
  }

  findActivePeriods() {
    return this.periodsRepository.findActivePeriods();
  }

  async findActivePeriodById(periodId: string) {
    const period = await this.periodsRepository.findActivePeriodById(periodId);

    if (!period) {
      // Add i18n
      throw new Exception('Period is not active')
    }

    return period;
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

  async remove(id: string) {
    const periodDeleted =  await this.periodsRepository.remove(id);
    await this.teacherService.removeTeachersByPeriod(id);
    await this.subjectService.removeSubjectsByPeriod(id);
    return periodDeleted;
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
