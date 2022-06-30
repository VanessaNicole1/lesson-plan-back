import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { createReadStream } from 'fs';
import * as csvParser from 'csv-parser';
import { Helpers } from '../helpers/helpers';
import { TeachersService } from './teachers.service';
import { Teacher } from './teacher.entity';
import { UpdateTeacherDto } from './dto/update-teacher-dto';

@Controller('teachers')
export class TeachersController {
  constructor(private teacherService: TeachersService) {}

  @Get('/:id')
  getTeacherById(@Param('id') id: string): Promise<Teacher> {
    return this.teacherService.getTeacherById(id);
  }

  // @Get('/all/:id')
  // getTeachersList(@Param('id') id: string): Promise<Teacher[]> {
  //   return this.studentsService.getStudents(id);
  // }

  @Post()
  @UseInterceptors(
    FileInterceptor('doc', {
      storage: diskStorage({
        destination: './files-csv',
        filename: Helpers.editFileNameTeacher,
      }),
    }),
  )
  createTeachers(@UploadedFile() file) {
    const fileName = file.originalname;
    const results = [];
    createReadStream(`files-csv/${fileName}`)
      .pipe(csvParser())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        for (let i = 0; i < results.length; i++) {
          const element = results[i];
          return this.teacherService.createTeacher(element);
        }
      });
    return {
      statusCode: 200,
      body: 'Los profesores han sido creados con éxito',
    };
  }

  @Delete('/:id')
  deleteTeacher(@Param('id') id: string): Promise<void> {
    return this.teacherService.deleteTeacher(id);
  }

  @Patch()
  updateStudent(updateTeacherDto: UpdateTeacherDto) {
    return this.teacherService.updateStudent(updateTeacherDto);
  }
}
