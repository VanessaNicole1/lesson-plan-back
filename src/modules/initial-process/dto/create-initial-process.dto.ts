import { CreateStudentGradeDto } from '../../students/dto/create-student-grade-dto';
import { CreateDegreeDto } from '../../degree/dto/create-degree-dto';
import { Type } from 'class-transformer';
import { ValidateNested, IsNotEmpty, IsUUID } from 'class-validator';
import { CreatePeriodDto } from '../../period/dto/create-period-dto';
import { CreateTeacherSubjectGradeDto } from 'src/modules/teachers/dto/create-teacher-subject-grade-dto';
export class CreateInitialProcessDto {
  @ValidateNested()
  @Type(() => CreatePeriodDto)
  period: CreatePeriodDto;

  @ValidateNested()
  @Type(() => CreateDegreeDto)
  degree: CreateDegreeDto;

  @IsNotEmpty()
  @IsUUID()
  userId: string;

  students: CreateStudentGradeDto[];

  teachers: CreateTeacherSubjectGradeDto[];
}
