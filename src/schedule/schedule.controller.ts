import { Body, Controller, Param, Put } from '@nestjs/common';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { ScheduleService } from './schedule.service';

@Controller('teachers')
export class TeachersController {
  constructor(private scheduleService: ScheduleService) {}

  @Put(':id')
  updateSchedule(
    @Param('id') id: string,
    @Body() updateSchedule: UpdateScheduleDto,
  ) {
    return this.scheduleService.updateSchedule(id, updateSchedule);
  }
}
