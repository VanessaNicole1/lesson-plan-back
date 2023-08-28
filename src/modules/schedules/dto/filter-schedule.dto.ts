import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class FilterScheduleDto {
  @IsOptional()
  @IsString()
  periodId?: string;

  @IsOptional()
  @IsString()
  subjectId?: string;

  @IsOptional()
  @IsString()
  gradeId?: string;

  @IsOptional()
  @IsString()
  hasQualified?: string;

  @IsOptional()
  @IsString()
  type?: string;
}
