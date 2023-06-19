import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateLessonPlanTrackingDto {
  @IsNotEmpty()
  @IsString()
  lessonPlanId: string;

  @IsNotEmpty()
  @IsArray()
  students?: string[];
}
