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
import { I18n, I18nContext } from 'nestjs-i18n';
import { TeachersService } from './teachers.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { ValidateTeachersDto } from './dto/validate-teachers.dto';
import { FilterTeacherDto } from './dto/filter-teacher.dto';
import { DtoArrayErrorExceptionFilter } from '../common/exception-filters/dto-array-error-exception.filter';

@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Post()
  create(@Body() createTeacherDto: CreateTeacherDto) {
    return this.teachersService.create(createTeacherDto);
  }

  @Post()
  findAll(@Body() filterTeacherDto: FilterTeacherDto) {
    return this.teachersService.findAll(filterTeacherDto);
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
  @UseFilters(new DtoArrayErrorExceptionFilter(/teachers\.\d+\./))
  validateTeachers(
    @Body() validateTeachersDto: ValidateTeachersDto,
    @I18n() i18n: I18nContext  
  ) {
    const { teachers } = validateTeachersDto;
    return this.teachersService.validateTeachers(teachers, i18n);
  }
}
