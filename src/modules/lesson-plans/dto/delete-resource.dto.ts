import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateLessonPlanDto } from './create-lesson-plan.dto';
import { IsString } from 'class-validator';

export class DeleteResourceDto {
    @IsString()
    name: string;
}
