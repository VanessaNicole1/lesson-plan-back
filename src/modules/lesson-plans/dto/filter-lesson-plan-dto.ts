import { IsOptional, IsString, IsUUID } from 'class-validator';
import { LessonPlanType } from '../../../modules/common/enums/lesson-plan-type.enum';

export class FilterLessonPlanDTO {
  @IsUUID()
  period: string;

  @IsOptional()
  @IsString()
  type: LessonPlanType

  // By Query Params all attributes are string
  @IsOptional()
  isValidatedByManager: string

  @IsUUID()
  @IsOptional()
  userId: string

  @IsUUID()
  @IsOptional()
  studentId: string

  @IsOptional()
  isValidatedByStudent: string
}
