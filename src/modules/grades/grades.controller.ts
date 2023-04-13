import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { GradesService } from './grades.service';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { ValidateGradesMatchDto } from './dto/validate-grades-match.dto';
import { FilterGradeDto } from './dto/filter-grade.dto';

@Controller('grades')
export class GradesController {
  constructor(private readonly gradesService: GradesService) {}

  @Post('create')
  create(@Body() createGradeDto: CreateGradeDto) {
    return this.gradesService.create(createGradeDto);
  }

  @Post()
  findAll(@Body() filterGradeDto: FilterGradeDto) {
    return this.gradesService.findAll(filterGradeDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gradesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGradeDto: UpdateGradeDto) {
    return this.gradesService.update(+id, updateGradeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gradesService.remove(+id);
  }

  @Post('validate')
  @HttpCode(200)
  validateGradesMatch(@Body() validateGradesMatchDto: ValidateGradesMatchDto) {
    return this.gradesService.validateGradesMatch(validateGradesMatchDto);
  }
}
