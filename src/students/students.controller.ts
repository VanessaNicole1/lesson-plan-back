import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { createReadStream } from 'fs';
import * as csvParser from 'csv-parser';
import { Helpers } from '../helpers/helpers';
import { UpdateStudentDto } from './dto/update-student-dto';
import { Student } from './student.entity';
import { AuthGuard } from '@nestjs/passport';
import { ValidManager } from 'src/auth/valid-manager.guard';
import { Roles } from 'src/auth/enums/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';

@Controller('students')
export class StudentsController {
  constructor(private studentsService: StudentsService) {}

  @Get('/:id')
  getStudentById(@Param('id') id: string): Promise<Student> {
    return this.studentsService.getStudentById(id);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), ValidManager)
  @Roles(Role.Manager)
  getAllStudents() {
    return this.studentsService.getAllStudents();
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), ValidManager)
  @Roles(Role.Manager)
  @UseInterceptors(
    FileInterceptor('doc', {
      storage: diskStorage({
        destination: './files-csv',
        filename: Helpers.editFileName,
      }),
    }),
  )
  createStudent(@UploadedFile() file) {
    if (!file) {
      return {
        statusCode: 400,
        body: 'El archivo es requerido',
      };
    }
    const fileName = file.originalname;

    const results = [];
    createReadStream(`files-csv/${fileName}`)
      .pipe(csvParser())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        for (let i = 0; i < results.length; i++) {
          const elements = results[i];
          this.studentsService.createStudent(elements);
        }
      });
    return {
      statusCode: 200,
      body: 'Los estudiantes han sido creados con exito',
    };
  }

  @Delete('/:id')
  @UseGuards(AuthGuard('jwt'), ValidManager)
  @Roles(Role.Manager)
  deleteStudent(@Param('id') id: string): Promise<void> {
    return this.studentsService.deleteStudent(id);
  }

  @Put('/:id')
  @UseGuards(AuthGuard('jwt'), ValidManager)
  @Roles(Role.Manager)
  updateStudent(updateStudentDto: UpdateStudentDto) {
    return this.studentsService.updateStudent(updateStudentDto);
  }
}
