import {
  Controller,
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

@Controller('students')
export class StudentsController {
  constructor(private studentsService: StudentsService) {}

  @Get('/:id')
  getStudentById(@Param('id') id: string): Promise<Student> {
    return this.studentsService.getStudentById(id);
  }

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
    createReadStream(`files-csv/${fileName}`)
      .pipe(csvParser())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        for (let i = 0; i < results.length; i++) {
          const element = results[i];
          return this.studentsService.createStudent(element);
        }
      });
    return {
      statusCode: 200,
      body: 'Los estudiantes han sido creados con exito',
    };
  }

  deleteStudent(id: string) {
    return this.studentsService.deleteStudent(id);
  }

  updateStudent(updateStudentDto: UpdateStudentDto) {
    return this.studentsService.updateStudent(updateStudentDto);
  }

  studentList() {
    return this.studentsService.getStudents();
  }
}
