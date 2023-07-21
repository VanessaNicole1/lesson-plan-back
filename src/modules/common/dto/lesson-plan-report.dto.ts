import { IsDateString, IsNotEmpty, IsUUID } from "class-validator";

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

  @IsNotEmpty()
  @IsUUID()
  subjectId: string

  @IsNotEmpty()
  @IsUUID()
  gradeId: string
}
