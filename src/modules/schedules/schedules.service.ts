import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { SchedulesRepository } from './schedules.repository';
import { TeachersService } from '../teachers/teachers.service';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
export class SchedulesService {

  readonly baseI18nKey = 'schedules.service';

  constructor (
    private schedulesRepository: SchedulesRepository,
    private teacherService: TeachersService,
    private i18nService: I18nService
  ) {}

  findAll() {
    return this.schedulesRepository.findAll();
  }

  async findSchedulesByUsterInActivePeriod(periodId: string, userId: string) {
    const teacher = await this.teacherService.findTeacherByUserInActivePeriod(periodId, userId);
    return this.schedulesRepository.findSchedulesByTeacherInActivePeriod(periodId, teacher.id);
  };

  async findOne(id: string, i18nContext: I18nContext = undefined) {
    const i18n = i18nContext || this.i18nService;
    const schedule = await this.schedulesRepository.findOne(id);

    if (!schedule) {
      throw new NotFoundException(
        i18n.t(`${this.baseI18nKey}.findOne.SCHEDULE_DOES_NOT_EXIST`, { 
          args: {
            id
          }
        })
      );
    }

    return schedule;
  }

  async update(id: string, updateScheduleDto: UpdateScheduleDto) {
    const schedule = await this.schedulesRepository.findOne(id)
    return this.schedulesRepository.update(schedule.id, updateScheduleDto);
  }
}
