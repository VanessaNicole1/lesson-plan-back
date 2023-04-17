import { BadRequestException, Injectable } from '@nestjs/common';
import { isEmailDomainValid } from '../../utils/email.utils';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { FilterTeacherDto } from './dto/filter-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { TeachersRepository } from './teachers.repository';
import { I18nContext } from 'nestjs-i18n';

@Injectable()
export class TeachersService {
  readonly baseI18nKey = 'teachers.service';

  constructor(
    private teachersRepository: TeachersRepository,
  ) {}

  create(createTeacherDto: CreateTeacherDto) {
    return 'This action adds a new teacher';
  }

  findAll(filterTeacherDto?: FilterTeacherDto) {
    return this.teachersRepository.findAll(filterTeacherDto);
  }

  findOne(id: number) {
    return `This action returns a #${id} teacher`;
  }

  update(id: number, updateTeacherDto: UpdateTeacherDto) {
    return `This action updates a #${id} teacher`;
  }

  remove(id: number) {
    return `This action removes a #${id} teacher`;
  }

  validateTeacherEmail(createTeacherDto: CreateTeacherDto, i18nContext: I18nContext) {
    const { email } = createTeacherDto;
    const isDomainValid = isEmailDomainValid(email);

    if (!isDomainValid) {
      throw new BadRequestException(
        i18nContext.t('common.INSTITUTIONAL_EMAIL')
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
      let message = i18nContext.t(`${this.baseI18nKey}.validateTeachers.SAME_SUBJECT`);
      for (const duplicatedTeachers of duplicatedTeachersBySubjectAndGrade) {
        const { first, second, subject, grade } = duplicatedTeachers;
        const duplicatedTeachersMessage = i18nContext.t(
          `${this.baseI18nKey}.validateTeachers.SAME_SUBJECT_TEACHERS`,
          { 
            args: {
              first,
              second,
              subject,
              grade
            }
          }
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
