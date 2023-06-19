import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Query,
} from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { I18n, I18nContext } from 'nestjs-i18n';

@Controller('schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Get()
  findAll() {
    return this.schedulesService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @I18n() i18nContext: I18nContext
  ) {
    return this.schedulesService.findOne(id, i18nContext);
  }

  @Get('period/:periodId')
  findSchedulesByUsterInActivePeriod(@Param('periodId') periodId: string, @Query('userId') userId: string) {
    return this.schedulesService.findSchedulesByUsterInActivePeriod(periodId, userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateScheduleDto: UpdateScheduleDto) {
    return this.schedulesService.update(id, updateScheduleDto);
  }
}
