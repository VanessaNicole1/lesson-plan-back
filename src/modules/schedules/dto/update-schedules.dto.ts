import { PartialType } from '@nestjs/mapped-types';
import { CreateScheduleDto } from './create-schedule.dto';
import { UpdateScheduleDto } from './update-schedule.dto';
import { ValidateNested } from 'class-validator';

export class UpdateSchedulesDto extends PartialType(CreateScheduleDto) {
  @ValidateNested()
  schedules: UpdateScheduleDto[]
}
