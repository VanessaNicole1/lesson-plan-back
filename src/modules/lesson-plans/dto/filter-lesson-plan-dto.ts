import { IsOptional, IsString, IsUUID } from 'class-validator';

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
}
