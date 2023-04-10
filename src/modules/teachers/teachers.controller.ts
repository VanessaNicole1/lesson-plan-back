import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, UseFilters } from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { ValidateTeachersDto } from './dto/validate-teachers.dto';
import { HttpExceptionFilter } from '../common/exception-filters/http.exception-filter';

@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Post()
  create(@Body() createTeacherDto: CreateTeacherDto) {
    return this.teachersService.create(createTeacherDto);
  }

  @Get()
  findAll() {
    return this.teachersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teachersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTeacherDto: UpdateTeacherDto) {
    return this.teachersService.update(+id, updateTeacherDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teachersService.remove(+id);
  }

  @Post('validate')
  @HttpCode(200)
  @UseFilters(new HttpExceptionFilter())
  valdateTeachers(@Body() validateTeachersDto: ValidateTeachersDto) {
    const { teachers } = validateTeachersDto;
    return this.teachersService.validateTeachers(teachers);
  }
}
