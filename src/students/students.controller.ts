import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { createReadStream } from 'fs';
import * as csvParser from 'csv-parser';
import { Helpers } from '../helpers/helpers';
import { UpdateStudentDto } from './dto/update-student-dto';
import { Student } from '../../dist/students/student.model';
import { GradeService } from 'src/grade/grade.service';

@Controller('students')
export class StudentsController {
  constructor(
    private studentsService: StudentsService,
    private readonly gradeService: GradeService,
  ) {}

  @Get('/:id')
  getStudentById(@Param('id') id: string): Promise<Student> {
    return this.studentsService.getStudentById(id);
  }

  // @Get('/all/:id')
  // getstudentList(@Param('id') id: string): Promise<Student[]> {
  //   return this.studentsService.getStudents(id);
  // }

  @Post()
  @UseInterceptors(
    FileInterceptor('doc', {
      storage: diskStorage({
        destination: './files-csv',
        filename: Helpers.editFileName,
      }),
    }),
  )
  createStudent(@UploadedFile() file) {
    const fileName = file.originalname;
    const results = [];
    //let students = [];
    //let grades = [];
    createReadStream(`files-csv/${fileName}`)
      .pipe(csvParser())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        console.log('R: ', results);
        for (let i = 0; i < results.length; i++) {
          const elements = results[i];
          console.log('est: ', i);
          return this.studentsService.createStudent(
            elements,
            elements,
            this.gradeService,
          );
        }
      });
    return {
      statusCode: 200,
      body: 'Los estudiantes han sido creados con exito',
    };
  }

  @Delete('/:id')
  deleteStudent(@Param('id') id: string): Promise<void> {
    return this.studentsService.deleteStudent(id);
  }

  updateStudent(updateStudentDto: UpdateStudentDto) {
    return this.studentsService.updateStudent(updateStudentDto);
  }
}
