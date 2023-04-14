import { BadRequestException, Injectable } from '@nestjs/common';
import {
  getDuplicatedEmails,
  isEmailDomainValid,
} from '../../utils/email.utils';
import { CreateStudentDto } from './dto/create-student.dto';
import { FilterStudentDto } from './dto/filter-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentsRepository } from './students.repository';
import { I18nContext } from 'nestjs-i18n';

@Injectable()
export class StudentsService {
  readonly baseI18nKey = 'students.service';
  
  constructor(private studentsRepository: StudentsRepository) {}

  create(createStudentDto: CreateStudentDto) {
    return 'This action adds a new student';
  }

  findAll(filterStudentDto?: FilterStudentDto) {
    return this.studentsRepository.findAll(filterStudentDto);
  }

  findOne(id: number) {
    return `This action returns a #${id} student`;
  }

  update(id: number, updateStudentDto: UpdateStudentDto) {
    return `This action updates a #${id} student`;
  }

  remove(id: number) {
    return `This action removes a #${id} student`;
  }

  validateStudentEmail(createStudentDto: CreateStudentDto, i18nContext: I18nContext) {
    const { email } = createStudentDto;
    const isDomainValid = isEmailDomainValid(email);

    if (!isDomainValid) {
      throw new BadRequestException(i18nContext.t('common.INSTITUTIONAL_EMAIL'));
    }
  }

  validateStudents(createStudentsDto: CreateStudentDto[], i18nContext: I18nContext) {
    const studentsEmails = createStudentsDto.map(({ email }) => email);
    const duplicatedEmails = getDuplicatedEmails(studentsEmails);

    if (duplicatedEmails.length > 0) {
      throw new BadRequestException(
        `${i18nContext.t(`${this.baseI18nKey}.validateStudents.DUPLICATED_EMAILS`)} ${duplicatedEmails.join(', ')}`
      );
    }

    for (const studentDto of createStudentsDto) {
      this.validateStudentEmail(studentDto, i18nContext);
    }
  }
}
