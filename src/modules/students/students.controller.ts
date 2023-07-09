import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  UseFilters,
  Query,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { ValidateStudentsDto } from './dto/validate-students.dto';
import { FilterStudentDto } from './dto/filter-student.dto';
import { I18n, I18nContext } from 'nestjs-i18n';
import { DtoArrayErrorExceptionFilter } from '../common/exception-filters/dto-array-error-exception.filter';
import { GetLessonPlansDto } from './dto/get-lesson-plans.dto';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get('/lesson-plans')
  getLessonPlansInActivePeriods(@Query() getLessonPlansDto: GetLessonPlansDto) {
    return this.studentsService.getLessonPlansInActivePeriods(getLessonPlansDto);
  }

  @Get(':id/active-periods')
  findTeacherActivePeriodsByUser(
    @Param('id') id: string,
    @I18n() i18nContext: I18nContext,
  ) {
    return this.studentsService.findStudentActivePeriodsByUser(id, i18nContext);
  }

  @Post()
  findAll(@Body() filterStudentDto: FilterStudentDto) {
    return this.studentsService.findAll(filterStudentDto);
  }

  @Post('validate')
  @HttpCode(200)
  @UseFilters(new DtoArrayErrorExceptionFilter(/students\.\d+\./))
  validateStudents(
    @Body() validateStudentsDto: ValidateStudentsDto,
    @I18n() i18nContext: I18nContext
  ) {
    const { students } = validateStudentsDto;
    return this.studentsService.validateStudents(students, i18nContext);
  }

  
}
