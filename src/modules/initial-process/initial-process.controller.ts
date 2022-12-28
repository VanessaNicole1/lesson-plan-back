import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { Helpers } from 'src/helpers/helpers';
import { CreateGradeDto } from '../grade/dto/create-grade-dto';
import { CreatePeriodAndDegreeDto } from './dto/create-period-degree.dto';
import { InitialProcessService } from './initial-process.service';

@Controller('initial-process')
export class InitialProcessController {
  constructor(private initialProcessService: InitialProcessService) {}

  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  async createInitialProcess(
    createPeriodAndDegreeDto: CreatePeriodAndDegreeDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const studentColumns = [
      'name',
      'lastName',
      'email',
      'numberParallel',
      'parallel',
    ];
    const teacherColumns = ['name', 'lastName', 'email'];
    const subjectColumns = ['name'];

    const dataStudents = files[0].buffer.toString();
    const dataTeachers = files[1].buffer.toString();
    const dataSubjects = files[2].buffer.toString();

    const studentResults = Helpers.validateCsv(dataStudents, studentColumns);
    const teacherResults = Helpers.validateCsv(dataTeachers, teacherColumns);
    const subjectResults = Helpers.validateCsv(dataSubjects, subjectColumns);

    await Helpers.duplicatedEmails(studentResults);
    await Helpers.duplicatedEmails(teacherResults);
    await Helpers.duplicatedNames(subjectResults);

    return this.initialProcessService.createInitialProcess(
      createPeriodAndDegreeDto,
      studentResults,
      teacherResults,
      subjectResults,
    );
  }
}
