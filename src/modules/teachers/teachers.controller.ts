import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  UseFilters,
  Query,
  Put,
} from '@nestjs/common';
import { I18n, I18nContext } from 'nestjs-i18n';
import { TeachersService } from './teachers.service';
import { ValidateTeachersDto } from './dto/validate-teachers.dto';
import { FilterTeacherDto } from './dto/filter-teacher.dto';
import { DtoArrayErrorExceptionFilter } from '../common/exception-filters/dto-array-error-exception.filter';
import { UpdateTeacherEventConfigDto } from './dto/update-teacher-config.dto';

@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Post()
  findAll(@Body() filterTeacherDto: FilterTeacherDto) {
    return this.teachersService.findAll(filterTeacherDto);
  }

  @Get(':id/active-periods')
  findTeacherActivePeriodsByUser(
    @Param('id') id: string,
    @I18n() i18nContext: I18nContext,
  ) {
    return this.teachersService.findTeacherActivePeriodsByUser(id, i18nContext);
  }

  @Get('/period/:periodId')
  findTeachersByUserInActivePeriod(
    @Param('periodId') periodId: string,
    @Body() bodyRequest,
    @I18n() i18nContext: I18nContext,
  ) {
    const { userId } = bodyRequest;
    return this.teachersService.findTeacherByUserInActivePeriod(
      periodId,
      userId,
      i18nContext,
    );
  }

  @Get('events')
  findTeacherEventsInActivePeriod(@Query() query) {
    const { userId, periodId } = query;
    return this.teachersService.findTeacherEventsInActivePeriod(
      periodId,
      userId,
    );
  }

  @Post('validate')
  @HttpCode(200)
  @UseFilters(new DtoArrayErrorExceptionFilter(/teachers\.\d+\./))
  validateTeachers(
    @Body() validateTeachersDto: ValidateTeachersDto,
    @I18n() i18n: I18nContext,
  ) {
    const { teachers } = validateTeachersDto;
    return this.teachersService.validateTeachers(teachers, i18n);
  }

  @Put('/event-config/:id')
  updateEventConfig(
    @Param('id') id: string,
    @Body() updateTeacherEventConfigDto: UpdateTeacherEventConfigDto,
  ) {
    return this.teachersService.updateTeacherEventConfig(
      id,
      updateTeacherEventConfigDto,
    );
  }

  @Get(':id/periods')
  findTeacherPeriodsByUser(
    @Param('id') id: string,
    @I18n() i18nContext: I18nContext,
  ) {
    return this.teachersService.findTeacherPeriodsByUser(id, i18nContext);
  }
}
