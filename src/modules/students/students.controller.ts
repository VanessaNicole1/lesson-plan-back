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
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { ValidateStudentsDto } from './dto/validate-students.dto';
import { HttpExceptionFilter } from '../common/exception-filters/http.exception-filter';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.create(createStudentDto);
  }

  @Get('')
  findAll(@Query('period') periodId?: string) {
    return this.studentsService.findAll(periodId);
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
  @UseFilters(new HttpExceptionFilter())
  validateStudents(@Body() validateStudentsDto: ValidateStudentsDto) {
    const { students } = validateStudentsDto;
    return this.studentsService.validateStudents(students);
  }
}
