import { IsDefined, ValidateNested } from 'class-validator';
import { CreateDegreeDto } from '../../degrees/dto/create-degree.dto';
import { CreateManagerDto } from '../../managers/dto/create-manager.dto';
import { CreatePeriodDto } from '../../periods/dto/create-period.dto';
import { CreateStudentDto } from '../../students/dto/create-student.dto';
import { CreateTeacherDto } from '../../teachers/dto/create-teacher.dto';
import { CreateMinimumNumberOfStudentsToEvaluateDto } from '../../number-students-graded/dto/create-minimum-number-students-to-evaluate.dto';
import { i18nValidationMessage } from "nestjs-i18n";

const baseI18nKey = 'initial-process.dtos.createInitialProcessDto';

export class CreateInitialProcessDto {
  @ValidateNested()
  @IsDefined({ message: i18nValidationMessage(`${baseI18nKey}.NOT_DEFINED_PERIOD`) })
  period: CreatePeriodDto;

  @ValidateNested()
  @IsDefined({ message: i18nValidationMessage(`${baseI18nKey}.NOT_DEFINED_MANAGER`) })
  manager: CreateManagerDto;

  @ValidateNested()
  @IsDefined({ message: i18nValidationMessage(`${baseI18nKey}.NOT_DEFINED_DEGREE`) })
  degree: CreateDegreeDto;

  @ValidateNested({ each: true })
  @IsDefined({ message: i18nValidationMessage(`${baseI18nKey}.NOT_DEFINED_STUDENTS`) })
  students: CreateStudentDto[];

  @ValidateNested({ each: true })
  @IsDefined({ message: i18nValidationMessage(`${baseI18nKey}.NOT_DEFINED_TEACHERS`) })
  teachers: CreateTeacherDto[];

  @ValidateNested({ each: true })
  @IsDefined({ message: i18nValidationMessage(`${baseI18nKey}.NUMBER_STUDENTS_REQUIRED`) })
  minimumNumberOfStudentsToEvaluate: CreateMinimumNumberOfStudentsToEvaluateDto;
}
