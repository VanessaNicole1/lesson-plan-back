import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Query,
  ValidationPipe,
  UsePipes,
  UseGuards,
} from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { I18n, I18nContext } from 'nestjs-i18n';
import { FilterScheduleDto } from './dto/filter-schedule.dto';
import { AuthenticationGuard } from '../common/guards/authentication.guard';

@Controller('schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Get()
  @UseGuards(AuthenticationGuard)
  findAll() {
    return this.schedulesService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthenticationGuard)
  findOne(@Param('id') id: string, @I18n() i18nContext: I18nContext) {
    return this.schedulesService.findOne(id, i18nContext);
  }

  @Get('period/:periodId')
  @UseGuards(AuthenticationGuard)
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
  @UseGuards(AuthenticationGuard)
  update(
    @Param('id') id: string,
    @Body() updateScheduleDto: UpdateScheduleDto,
  ) {
    return this.schedulesService.update(id, updateScheduleDto);
  }

  @Get('teacher/:teacherId')
  @UseGuards(AuthenticationGuard)
  findByTeacher(@Param('teacherId') teacherId: string) {
    return this.schedulesService.findByTeacher(teacherId);
  }

  @Get('lesson-plans/:userId')
  @UseGuards(AuthenticationGuard)
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
