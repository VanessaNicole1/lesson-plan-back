import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateLessonPlanDto } from './create-lesson-plan.dto';
import { IsString } from 'class-validator';

export class UpdateLessonPlanDto extends PartialType(
  OmitType(CreateLessonPlanDto, ['scheduleId'] as const),
) {
  @IsString()
  deadlineNotification: string;
}
