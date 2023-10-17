import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  UseFilters,
  Query,
  UseGuards,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { ValidateStudentsDto } from './dto/validate-students.dto';
import { FilterStudentDto } from './dto/filter-student.dto';
import { I18n, I18nContext } from 'nestjs-i18n';
import { DtoArrayErrorExceptionFilter } from '../common/exception-filters/dto-array-error-exception.filter';
import { GetLessonPlansDto } from './dto/get-lesson-plans.dto';
import { AuthenticationGuard } from '../common/guards/authentication.guard';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get('/lesson-plans')
  @UseGuards(AuthenticationGuard)
  getLessonPlansInActivePeriods(@Query() getLessonPlansDto: GetLessonPlansDto) {
    return this.studentsService.getLessonPlansInActivePeriods(getLessonPlansDto);
  }
  
  @Get(':userId/lesson-plan-to-validate')
  @UseGuards(AuthenticationGuard)
  getLessonPlanIfStudentIsAllowedToValidate(
    @Param('userId') userId: string,
    @Query() queryParams
  ) {
    const { lessonPlanId } = queryParams;
    return this.studentsService.getLessonPlanIfStudentIsAllowedToValidate(userId, lessonPlanId);
  }

  @Get(':id/active-periods')
  @UseGuards(AuthenticationGuard)
  findTeacherActivePeriodsByUser(
    @Param('id') id: string,
    @I18n() i18nContext: I18nContext,
  ) {
    return this.studentsService.findStudentActivePeriodsByUser(id, i18nContext);
  }

  @Post()
  @UseGuards(AuthenticationGuard)
  findAll(@Body() filterStudentDto: FilterStudentDto) {
    return this.studentsService.findAll(filterStudentDto);
  }

  @Post('validate')
  @UseGuards(AuthenticationGuard)
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
