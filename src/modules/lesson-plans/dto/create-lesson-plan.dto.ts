import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateLessonPlanDto {
  @IsNotEmpty()
  @IsString()
  periodId: string;

  @IsNotEmpty()
  @IsString()
  scheduleId: string;

  @IsNotEmpty()
  @IsDateString()
  date: Date;

  @IsNotEmpty()
  @IsString()
  topic: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  students: any;

  @IsNotEmpty()
  @IsString()
  purposeOfClass: string;

  @IsNotEmpty()
  @IsString()
  results: string;

  @IsNotEmpty()
  @IsString()
  bibliography: string;

  @IsNotEmpty()
  @IsString()
  materials: string;

  @IsNotEmpty()
  @IsString()
  evaluation: string;

  @IsNotEmpty()
  @IsString()
  comments: string;

  @IsOptional()
  @IsArray()
  resources?: string[];

  @IsNotEmpty()
  notification: string;

  @IsOptional()
  notificationDate: Date | null;

  @IsOptional()
  deadlineDate: Date;
}
