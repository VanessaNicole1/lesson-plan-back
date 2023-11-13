// @ts-nocheck
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
import { ManagersService } from '../managers/managers.service';

@Injectable()
export class PeriodsService {
  readonly baseI18nKey = 'periods.service';

  constructor(
    private periodsRepository: PeriodsRepository,
    private subjectService: SubjectsService,
    private i18nService: I18nService,
    private teacherService: TeachersService,
    private managerService: ManagersService,
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

  async findActivePeriodsWithAdditionalData() {
    return await this.periodsRepository.findActivePeriodsWithAdditionalData();
  }

  async remove(id: string) {
    const periodDeleted =  await this.periodsRepository.remove(id);
    await this.teacherService.removeTeachersByPeriod(id);
    await this.subjectService.removeSubjectsByPeriod(id);
    await this.managerService.removeByperiod(id);
    return periodDeleted;
  }

  async getPeriodWeeks(id: string) {
    const period = await this.findOne(id);
    const endDate = period.isActive ? new Date(): period.endDate;
    return this.getWeeksBetweenDates(period.startDate, endDate);
  }

  getWeeksBetweenDates(startDate: Date, endDate: Date): Week[] {
    const weeks: Week[] = [];
    let currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() - (currentDate.getDay() + 6) % 7);

    let weekId = 1;
    while (currentDate <= endDate) {
        const weekStartDate = new Date(currentDate);
        const weekEndDate = new Date(currentDate);
        weekEndDate.setDate(weekEndDate.getDate() + 4);

        const weekRange = `${weekStartDate.toLocaleDateString()} - ${weekEndDate.toLocaleDateString()}`;
        const weekName = `Semana ${weekId}`;

        weeks.push({
          id: weekId,
          name: weekName,
          range: weekRange,
          from: weekStartDate,
          to: weekEndDate
        });

        currentDate.setDate(currentDate.getDate() + 7);
        weekId++;
    }

    return weeks;
  }

  validateDates(createPeriodDto: CreatePeriodDto, i18nContext: I18nContext) {
    const { startDate, endDate } = createPeriodDto;

    if (endDate <= startDate) {
      throw new BadRequestException(
        i18nContext.t(`${this.baseI18nKey}.validateDates.GREATER_END_DATE`),
      );
    }
  }

  async deactivatePeriod(periodId: string) {
    return await this.periodsRepository.deactivatePeriod(periodId);
  }

  async getPeriodsToNotify() {
    const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
    const periods = await this.findActivePeriodsWithAdditionalData();
    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    const activePeriods = [];
    for (const period of periods) {
      const endDate = new Date(period.endDate);
      const milisecondsDifference = endDate.getTime() - oneDayInMilliseconds;
      const newDate = new Date(milisecondsDifference);
      const endDateDay = newDate.getUTCDate();
      const endDateMonth = newDate.getMonth() + 1;
      const endDateYear = newDate.getFullYear();
      const areSameDay = currentDay === endDateDay;
      const areSameMonth = currentMonth === endDateMonth;
      const areSameYear = currentYear === endDateYear;
      if (areSameDay && areSameMonth && areSameYear) {
          const activePeriod = {
            periodDisplayName: period.displayName,
            managerName: period.degree.manager?.user.displayName,
            managerEmail: period.degree.manager?.user.email,
            endDate: period.endDate,
          }
          activePeriods.push(activePeriod);
      }
    }
    return activePeriods;
  }

  areDatesEqual(firstDate: Date, secondDate: Date) {
    return (
      firstDate.getFullYear() === secondDate.getFullYear() &&
      firstDate.getMonth() + 1 === secondDate.getMonth() + 1 &&
      firstDate.getDate() === secondDate.getDate()
    );
  }

  async getPeriodToDeactivate() {
    const periods = await this.findActivePeriodsWithAdditionalData();
    const currentDate = new Date('2023-08-01');
    const periodsToDeactivate = [];
    for (const period of periods) {
      const endDate = new Date(period.endDate);
      const areSameDates = this.areDatesEqual(currentDate, endDate);
      if (areSameDates) {
        const currentPeriod = {
          periodId: period.id,
          periodDisplayName: period.displayName,
          managerName: period.degree?.manager?.user.displayName,
          managerEmail: period.degree.manager?.user.email,
          endDate: period.endDate
        }
        periodsToDeactivate.push(currentPeriod);
      }
    }
    return periodsToDeactivate;
  }
}