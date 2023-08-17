import { IsDateString, IsNotEmpty, IsOptional, IsUUID } from "class-validator";

// TODO: Add i18n
export class LessonPlanReportDto {
  @IsNotEmpty()
  @IsDateString()
  from: Date;

  @IsNotEmpty()
  @IsDateString()
  to: Date;

  @IsNotEmpty()
  @IsUUID()
  periodId: string

  @IsOptional()
  @IsUUID()
  subjectId?: string

  @IsOptional()
  @IsUUID()
  gradeId?: string
}
