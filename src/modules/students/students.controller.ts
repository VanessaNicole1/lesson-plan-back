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
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { ValidateStudentsDto } from './dto/validate-students.dto';
import { FilterStudentDto } from './dto/filter-student.dto';
import { I18n, I18nContext } from 'nestjs-i18n';
import { DtoArrayErrorExceptionFilter } from '../common/exception-filters/dto-array-error-exception.filter';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post('create')
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.create(createStudentDto);
  }

  @Post()
  findAll(@Body() filterStudentDto: FilterStudentDto) {
    return this.studentsService.findAll(filterStudentDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentsService.update(+id, updateStudentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentsService.remove(+id);
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
