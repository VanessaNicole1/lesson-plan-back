import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateGradeDto } from './dto/create-grade-dto';
import { UpdateGradeDto } from './dto/update-grade-dto';
import { Grade } from './grade.entity';
import { GradeService } from './grade.service';

@Controller('grades')
export class GradesController {
  constructor(private gradeService: GradeService) {}

  @Get('/:id')
  getGradeById(@Param('id') id: string): Promise<Grade> {
    return this.gradeService.getGradeById(id);
  }

  @Get()
  getAllGrades() {
    return this.gradeService.getAllGrade();
  }

  @Get('/:number/:parallel')
  getGradeByNameAndParallel(
    @Param('number') number: number,
    @Param('parallel') parallel: string,
  ) {
    return this.gradeService.getGradeByNameAndParallel(number, parallel);
  }

  @Post()
  createGrade(@Body() createGradeDto: CreateGradeDto) {
    return this.gradeService.createGrade(createGradeDto);
  }

  @Delete('/:id')
  deleteGrade(@Param('id') id: string): Promise<void> {
    return this.gradeService.deleteGrade(id);
  }

  @Put(':id')
  updateTeacher(
    @Param('id') id: string,
    @Body() updateGradeDto: UpdateGradeDto,
  ) {
    return this.gradeService.updateTeacher(id, updateGradeDto);
  }
}
