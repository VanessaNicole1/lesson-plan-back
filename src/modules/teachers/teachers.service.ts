import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { isEmailDomainValid } from '../../utils/email.utils';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { FilterTeacherDto } from './dto/filter-teacher.dto';
import { TeachersRepository } from './teachers.repository';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { UsersService } from '../users/users.service';
import { PeriodsService } from '../periods/periods.service';
import { UpdateTeacherEventConfigDto } from './dto/update-teacher-config.dto';
import { SchedulesService } from '../schedules/schedules.service';

@Injectable()
export class TeachersService {
  readonly baseI18nKey = 'teachers.service';

  constructor(
    private teachersRepository: TeachersRepository,
    private usersService: UsersService,
    @Inject(forwardRef(() => PeriodsService))
    private periodService: PeriodsService,
    private i18nService: I18nService,
    @Inject(forwardRef(() => SchedulesService))
    private schedulesService: SchedulesService,
  ) {}

  async findTeachersWithEmptyAD2OrCustomNotificationsInActivePeriods() {
    const activePeriods = await this.periodService.findActivePeriods();
    const activePeriodIds = activePeriods.map(
      (activePeriod) => activePeriod.id,
    );
    const teacherEventsConfig =
      await this.teachersRepository.findTeacherEventsConfigByPeriodIds(
        activePeriodIds,
      );
    const emptyTeacherEventsConfig =
      this.getEmptyEventsConfig(teacherEventsConfig);
    const teacherIds = [
      ...new Set(
        emptyTeacherEventsConfig.map((eventConfig) => eventConfig.teacherId),
      ),
    ];
    const teachers = await this.teachersRepository.findAllByTeacherIds(
      teacherIds as string[],
    );
    const teachersInformation = [];

    teachers.forEach((teacher) => {
      const teacherEventsConfig = emptyTeacherEventsConfig.filter(
        (eventConfig) => eventConfig.teacherId === teacher.id,
      );
      const teacherInformation = {
        ...teacher,
        eventsConfig: teacherEventsConfig,
      };
      teachersInformation.push(teacherInformation);
    });

    return teachersInformation;
  }

  async findTeachersWithEmptySchedulesConfigInActivePeriods() {
    const activePeriods = await this.periodService.findActivePeriods();
    const activePeriodIds = activePeriods.map(
      (activePeriod) => activePeriod.id,
    );
    const schedulesWithEmptyConfig =
      await this.schedulesService.findEmptySchedulesConfigByPeriodIds(
        activePeriodIds,
      );
    const teacherIds = [
      ...new Set(
        schedulesWithEmptyConfig.map((schedule) => schedule.teacherId),
      ),
    ] as string[];
    const teachers = await this.teachersRepository.findAllByTeacherIds(
      teacherIds,
    );
    const teachersInformation = [];

    teachers.forEach((teacher) => {
      const teacherShedulesWithEmptyConfig = schedulesWithEmptyConfig.filter(
        (schedule) => schedule.teacherId === teacher.id,
      );
      const teacherInformation = {
        ...teacher,
        schedules: teacherShedulesWithEmptyConfig,
      };
      teachersInformation.push(teacherInformation);
    });

    return teachersInformation;
  }

  findAll(filterTeacherDto?: FilterTeacherDto) {
    return this.teachersRepository.findAll(filterTeacherDto);
  }

  async findTeacherByUserInActivePeriod(
    periodId: string,
    userId: string,
    i18nContext: I18nContext = undefined,
  ) {
    const i18n = i18nContext || this.i18nService;
    const period = await this.periodService.findOne(periodId);
    const user = await this.usersService.findOne(userId);
    const teacher =
      await this.teachersRepository.findTeacherByUserInActivePeriod(
        period.id,
        user.id,
      );

    if (!teacher) {
      throw new NotFoundException(
        i18n.t(`${this.baseI18nKey}.common.NOT_ASSIGNED_TEACHER`),
      );
    }

    return teacher;
  }

  async findTeachersByUser(
    userId: string,
    i18nContext: I18nContext = undefined,
  ) {
    const i18n = i18nContext || this.i18nService;
    const teachers = await this.teachersRepository.findTeachersByUser(userId);

    if (teachers.length === 0) {
      throw new NotFoundException(
        i18n.t(`${this.baseI18nKey}.common.NOT_ASSIGNED_TEACHER`),
      );
    }

    return teachers;
  }

  async findTeacherActivePeriodsByUser(
    userId: string,
    i18nContext: I18nContext = undefined,
  ) {
    const i18n = i18nContext || this.i18nService;
    const user = await this.usersService.findOne(userId);
    await this.findTeachersByUser(userId, i18nContext);

    const activePeriods = await this.periodService.findActivePeriods();
    const activePeriodsIds = activePeriods.map(
      (activePeriod) => activePeriod.id,
    );
    const activePeriodsByTeacher =
      await this.teachersRepository.findTeacherActivePeriodsByUser(
        activePeriodsIds,
        user.id,
      );

    if (!activePeriodsByTeacher) {
      throw new BadRequestException(
        i18n.t(
          `${this.baseI18nKey}.findTeacherActivePeriodsByUser.NOT_TEACHERS_IN_ACTIVE_PERIODS`,
        ),
      );
    }

    const activePeriodsIdsByTeacher = activePeriodsByTeacher.map(
      (activePeriod) => activePeriod.periodId,
    );
    const activePeriodsInformation = this.periodService.findManyByPeriodIds(
      activePeriodsIdsByTeacher,
    );

    return activePeriodsInformation;
  }

  async findTeacherEventsInActivePeriod(periodId: string, userId: string) {
    const teacher = await this.findTeacherByUserInActivePeriod(
      periodId,
      userId,
    );
    return this.teachersRepository.findTeachersEvents(teacher.id);
  }

  async findTeacherPeriodsByUser(
    userId: string,
    i18nContext: I18nContext = undefined,
  ) {
    const i18n = i18nContext || this.i18nService;
    const user = await this.usersService.findOne(userId);
    await this.findTeachersByUser(userId, i18nContext);

    const periods = await this.periodService.findAll();
    const periodsIds = periods.map((activePeriod) => activePeriod.id);
    const periodsByTeacher =
      await this.teachersRepository.findTeacherActivePeriodsByUser(
        periodsIds,
        user.id,
      );

    if (!periodsByTeacher) {
      throw new BadRequestException(
        i18n.t(
          `${this.baseI18nKey}.findTeacherActivePeriodsByUser.NOT_TEACHERS_IN_ACTIVE_PERIODS`,
        ),
      );
    }

    const activePeriodsIdsByTeacher = periodsByTeacher.map(
      (activePeriod) => activePeriod.periodId,
    );
    const periodsInformation = this.periodService.findManyByPeriodIds(
      activePeriodsIdsByTeacher,
    );

    return periodsInformation;
  }

  updateTeacherEventConfig(
    id: string,
    updateTeacherEventConfigDto: UpdateTeacherEventConfigDto,
  ) {
    return this.teachersRepository.updateTeacherEventConfig(
      id,
      updateTeacherEventConfigDto,
    );
  }

  removeTeachersByPeriod(idPeriod: string) {
    return this.teachersRepository.removeTeachersByPeriod(idPeriod);
  }

  getEmptyEventsConfig(eventsConfig) {
    return eventsConfig.filter((eventConfig) => {
      if (!eventConfig.metadata) {
        return true;
      }

      if ((eventConfig.metadata as any).days.length === 0) {
        return true;
      }
    });
  }

  validateTeacherEmail(
    createTeacherDto: CreateTeacherDto,
    i18nContext: I18nContext,
  ) {
    const { email } = createTeacherDto;
    const isDomainValid = isEmailDomainValid(email);

    if (!isDomainValid) {
      throw new BadRequestException(
        i18nContext.t('common.INSTITUTIONAL_EMAIL'),
      );
    }
  }

  validateTeachers(teachers: CreateTeacherDto[], i18nContext: I18nContext) {
    for (const teacher of teachers) {
      this.validateTeacherEmail(teacher, i18nContext);
    }

    const duplicatedTeachersBySubjectAndGrade =
      this.getDuplicatedTeachersBySubjectAndGrade(teachers);

    if (duplicatedTeachersBySubjectAndGrade.length > 0) {
      let message = i18nContext.t(
        `${this.baseI18nKey}.validateTeachers.SAME_SUBJECT`,
      );
      for (const duplicatedTeachers of duplicatedTeachersBySubjectAndGrade) {
        const { first, second, subject, grade } = duplicatedTeachers;
        const duplicatedTeachersMessage = i18nContext.t(
          `${this.baseI18nKey}.validateTeachers.SAME_SUBJECT_TEACHERS`,
          {
            args: {
              first,
              second,
              subject,
              grade,
            },
          },
        );
        message += duplicatedTeachersMessage;
      }

      throw new BadRequestException(message);
    }
  }

  private getDuplicatedTeachersBySubjectAndGrade(teachers: CreateTeacherDto[]) {
    const uniqueTeachers = [];
    const duplicatedInfo = [];
    const getMetadataFromTeacher = ({
      subject,
      numberParallel,
      parallel,
    }: CreateTeacherDto) => `${numberParallel} - ${parallel} - ${subject}`;

    for (const teacher of teachers) {
      const teacherMetadata = getMetadataFromTeacher(teacher);

      const duplicatedTeacher: CreateTeacherDto = uniqueTeachers.find(
        (uniqueTeacher) => {
          const uniqueTeacherMetadata = getMetadataFromTeacher(uniqueTeacher);
          return teacherMetadata === uniqueTeacherMetadata;
        },
      );

      if (duplicatedTeacher) {
        const teachersInformation = {
          first: teacher.email,
          second: duplicatedTeacher.email,
          subject: teacher.subject,
          grade: `${teacher.numberParallel} "${teacher.parallel}"`,
        };

        duplicatedInfo.push(teachersInformation);
      } else {
        uniqueTeachers.push(teacher);
      }
    }

    return duplicatedInfo;
  }
}
