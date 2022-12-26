import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/modules/auth/roles.decorator';
import { Role } from 'src/modules/auth/enums/role.enum';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { ValidUser } from '../auth/guards/valid-user.guard';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

@Controller('schedule')
export class ScheduleController {
  constructor(private scheduleService: ScheduleService) {}

  @Post('/:id')
  @UseGuards(AuthGuard('jwt'), ValidUser)
  @Roles(Role.Teacher)
  createSchedule(
    @Body() createScheduleDto: CreateScheduleDto,
    @Param('id') id: string,
  ) {
    return this.scheduleService.createSchedule(createScheduleDto, id);
  }

  @Get('/:id')
  @UseGuards(AuthGuard('jwt'), ValidUser)
  @Roles(Role.Teacher)
  getSchedule(@Param('id') id: string) {
    return this.scheduleService.getScheduleByTeacher(id);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  deleteSchedule(@Param('id') id: string, @GetUser() user) {
    return this.scheduleService.deleteSchedule(id, user);
  }

  @Put('/:id')
  @UseGuards(JwtAuthGuard)
  updateSchedule(
    @Param('id') id: string,
    @GetUser() user,
    updateScheduleDto: UpdateScheduleDto,
  ) {
    return this.scheduleService.updateSchedule(id, user, updateScheduleDto);
  }
}
