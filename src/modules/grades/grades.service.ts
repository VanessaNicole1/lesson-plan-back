// @ts-nocheck
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateGradeDto } from './dto/create-grade.dto';
import { FilterGradeDto } from './dto/filter-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { ValidateGradesMatchDto } from './dto/validate-grades-match.dto';
import { GradesRepository } from './grades.repository';
import { I18nContext } from 'nestjs-i18n';

@Injectable()
export class GradesService {

  readonly baseI18nKey = 'grades.service';

  constructor(private gradesRepository: GradesRepository) {}

  create(createGradeDto: CreateGradeDto) {
    return 'This action adds a new grade';
  }

  findAll(filterGradeDto?: FilterGradeDto) {
    return this.gradesRepository.findAll(filterGradeDto);
  }

  findOne(id: number) {
    return `This action returns a #${id} grade`;
  }

  update(id: number, updateGradeDto: UpdateGradeDto) {
    return `This action updates a #${id} grade`;
  }

  remove(id: number) {
    return `This action removes a #${id} grade`;
  }

  validateGradesMatch(validateGradesMatchDto: ValidateGradesMatchDto, i18nContext: I18nContext) {
    const { students, teachers } = validateGradesMatchDto;

    const getGrades = ({ numberParallel, parallel }) =>
      `${numberParallel} ${parallel}`;

    const studentsGrades = [...new Set(students.map(getGrades))];
    const teachersGrades = [...new Set(teachers.map(getGrades))];
    const notMatchingGrades = [];

    for (const studentGrade of studentsGrades) {
      const matchingGradeIndex = teachersGrades.indexOf(studentGrade);

      if (matchingGradeIndex === -1) {
        notMatchingGrades.push(studentGrade);
      }
    }

    if (notMatchingGrades.length > 0) {
      const message = i18nContext.t(`${this.baseI18nKey}.validateGradesMatch.NOT_MATCHING_GRADES`);
      throw new BadRequestException(
        `${message} ${notMatchingGrades.join(', ')}`,
      );
    }
  }
}
