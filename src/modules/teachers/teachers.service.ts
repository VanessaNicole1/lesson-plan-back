import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { isEmailDomainValid } from '../../utils/email.utils';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { FilterTeacherDto } from './dto/filter-teacher.dto';
import { TeachersRepository } from './teachers.repository';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { UsersService } from '../users/users.service';
import { PeriodsService } from '../periods/periods.service';
import { UpdateTeacherEventConfigDto } from './dto/update-teacher-config.dto';

@Injectable()
export class TeachersService {
  readonly baseI18nKey = 'teachers.service';

  constructor(
    private teachersRepository: TeachersRepository,
    private usersService: UsersService,
    private periodService: PeriodsService,
    private i18nService: I18nService,
  ) {}

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
}
