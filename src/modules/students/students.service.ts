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
import { ValidateStudentsNumberDto } from './dto/validate-students-number.dto';

@Injectable()
export class StudentsService {
  readonly baseI18nKey = 'students.service';

  readonly initialProcessBaseI18nKey = 'initial-process.repository';
  
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

  validateStudentsNumber(validateStudentsNumberDto: ValidateStudentsNumberDto, minimumStudents: number, i18nContext: I18nContext) {
    let { students } = validateStudentsNumberDto;
    let mismatchedGrades = [];

    for (let i = 0; i < students.length; i++) {
      const student = students[i];
      let count = 0;
      const keyToValidate = JSON.stringify({ numberParallel: student.numberParallel, parallel: student.parallel });
      for (let j = 0; j < students.length; j++) {
        const studentToValidate = students[j];
        const keyValue = JSON.stringify({ numberParallel: studentToValidate.numberParallel, parallel: studentToValidate.parallel });
        if (keyToValidate === keyValue) {
          count += 1;
        }
      }
      if (count < minimumStudents) {
        mismatchedGrades.push(`${student.numberParallel} "${student.parallel}" `);
      }
      students = students.filter(obj => JSON.stringify({ numberParallel: obj.numberParallel, parallel: obj.parallel }) !== JSON.stringify({ numberParallel: student.numberParallel, parallel: student.parallel }) );
    }
    
    if (mismatchedGrades.length > 0) {
      throw new BadRequestException(`${i18nContext.t(`${this.initialProcessBaseI18nKey}.create.MINIMUM_STUDENTS`)} ${mismatchedGrades.join(', ')}`);
    }
  }
}
