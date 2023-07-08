import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Query,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { I18n, I18nContext } from 'nestjs-i18n';
import { FilterScheduleDto } from './dto/filter-schedule.dto';

@Controller('schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Get()
  findAll() {
    return this.schedulesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string, @I18n() i18nContext: I18nContext) {
    return this.schedulesService.findOne(id, i18nContext);
  }

  @Get('period/:periodId')
  findSchedulesByUsterInActivePeriod(
    @Param('periodId') periodId: string,
    @Query('userId') userId: string,
  ) {
    return this.schedulesService.findSchedulesByUsterInActivePeriod(
      periodId,
      userId,
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateScheduleDto: UpdateScheduleDto,
  ) {
    return this.schedulesService.update(id, updateScheduleDto);
  }

  @Get('teacher/:teacherId')
  findByTeacher(@Param('teacherId') teacherId: string) {
    return this.schedulesService.findByTeacher(teacherId);
  }

  @Get('lesson-plans/:userId')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  findLessonPlansByUserInPeriods(
    @Param('userId') userId: string,
    @Query() filterScheduleDto: FilterScheduleDto,
  ) {
    return this.schedulesService.findLessonPlansByUserInPeriods(
      userId,
      filterScheduleDto,
    );
  }
}
