// @ts-nocheck
import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { SchedulesRepository } from './schedules.repository';
import { TeachersService } from '../teachers/teachers.service';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { FilterScheduleDto } from './dto/filter-schedule.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class SchedulesService {
  readonly baseI18nKey = 'schedules.service';

  constructor(
    private schedulesRepository: SchedulesRepository,
    @Inject(forwardRef(() => TeachersService))
    private teacherService: TeachersService,
    private i18nService: I18nService,
    private usersService: UsersService,
  ) {}

  findAll() {
    return this.schedulesRepository.findAll();
  }

  async findSchedulesByUsterInActivePeriod(periodId: string, userId: string) {
    const teacher = await this.teacherService.findTeacherByUserInActivePeriod(
      periodId,
      userId,
    );
    return this.schedulesRepository.findSchedulesByTeacherInActivePeriod(
      periodId,
      teacher.id,
    );
  }

  async findEmptySchedulesConfigByPeriodIds(activePeriodIds: string[]) {
    const schedules = await this.schedulesRepository.findAllByPeriodIds(
      activePeriodIds,
    );

    const emptySchedules = schedules.filter((schedule) => {
      if (!schedule.metadata) {
        return true;
      }

      if ((schedule.metadata as any).days.length === 0) {
        return true;
      }
    });

    return emptySchedules;
  }

  async findOne(id: string, i18nContext: I18nContext = undefined) {
    const i18n = i18nContext || this.i18nService;
    const schedule = await this.schedulesRepository.findOne(id);

    if (!schedule) {
      throw new NotFoundException(
        i18n.t(`${this.baseI18nKey}.findOne.SCHEDULE_DOES_NOT_EXIST`, {
          args: {
            id,
          },
        }),
      );
    }

    return schedule;
  }

  async update(id: string, updateScheduleDto: UpdateScheduleDto) {
    const schedule = await this.schedulesRepository.findOne(id);
    return this.schedulesRepository.update(schedule.id, updateScheduleDto);
  }

  findByTeacher(teacherId: string) {
    return this.schedulesRepository.findByTeacher(teacherId);
  }

  async findLessonPlansByUserInPeriods(
    userId: string,
    filterScheduleDto: FilterScheduleDto,
    i18nContext: I18nContext = undefined,
  ) {
    const allLessonPlans = [];
    const user = await this.usersService.findOne(userId);
    const schedules = await this.schedulesRepository.findSchedulesByUser(
      userId,
      filterScheduleDto,
    );

    for (let i = 0; i < schedules.length; i++) {
      const { grade, subject, lessonPlans } = schedules[i];
      const { degree } = grade;
      const { period } = degree;

      // eslint-disable-next-line no-plusplus
      for (let j = 0; j < lessonPlans.length; j++) {
        const lessonPlan = lessonPlans[j];

        const currentLessonPlan = {
          period,
          id: lessonPlan.id,
          date: new Date(lessonPlan.date),
          subject,
          grade,
          hasQualified: lessonPlan.hasQualified,
          type: lessonPlan.type,
        };
        allLessonPlans.push(currentLessonPlan);
      }
    }
    return allLessonPlans;
  }
}
