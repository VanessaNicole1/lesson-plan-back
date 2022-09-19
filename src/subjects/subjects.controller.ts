import { Subject } from './subject.entity';
import { SubjectsService } from './subjects.service';
import { CreateSubjectDto } from './dto/create-subject-dto';
import { UpdateSubjectDto } from './dto/update-subject-dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';

@Controller('subjects')
export class SubjectsController {
  constructor(private subjectService: SubjectsService) {}

  @Get('/:id')
  getSubjectById(@Param('id') id: string): Promise<Subject> {
    return this.subjectService.getSubjectById(id);
  }

  @Get()
  findAllSubjects() {
    return this.subjectService.getAllSubjects();
  }

  @Post()
  createSubject(@Body() createSujectDto: CreateSubjectDto) {
    return this.subjectService.createSubject(createSujectDto);
  }

  @Delete('/:id')
  deleteSubject(@Param('id') id: string): Promise<void> {
    return this.subjectService.deleteSubject(id);
  }

  @Put(':id')
  updateSubject(
    @Param('id') id: string,
    @Body() updateSubjectDto: UpdateSubjectDto,
  ) {
    return this.subjectService.updateSubject(id, updateSubjectDto);
  }
}
