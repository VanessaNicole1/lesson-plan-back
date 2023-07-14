import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateLessonPlanDto } from './create-lesson-plan.dto';

export class UpdateLessonPlanDto extends PartialType(
  OmitType(CreateLessonPlanDto, ['scheduleId'] as const),
) {}
