import {
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Helpers } from '../../helpers/helpers';
import { UpdateStudentDto } from './dto/update-student-dto';
import { Student } from './student.entity';
import { AuthGuard } from '@nestjs/passport';
import { ValidManager } from 'src/modules/auth/valid-manager.guard';
import { Roles } from 'src/modules/auth/enums/decorators/roles.decorator';
import { Role } from 'src/modules/auth/enums/role.enum';
import { ValidUser } from 'src/modules/auth/valid-user.guard';

@Controller('students')
export class StudentsController {
  constructor(private studentsService: StudentsService) {}

  @Get('/:id')
  @UseGuards(AuthGuard('jwt'), ValidUser)
  @Roles(Role.Manager, Role.Student)
  getStudentById(@Param('id') id: string): Promise<Student> {
    return this.studentsService.getStudentById(id);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), ValidManager)
  @Roles(Role.Manager)
  getAllStudents() {
    return this.studentsService.getAllStudents();
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

  @Post('upload')
  @UseGuards(AuthGuard('jwt'), ValidManager)
  @Roles(Role.Manager)
  @UseInterceptors(FileInterceptor('file'))
  createStudents(@UploadedFile() file: Express.Multer.File) {
    const columns = ['name', 'lastName', 'email', 'numberParallel', 'parallel'];
    const data = file.buffer.toString();
    const results = Helpers.validateCsv(data, columns);
    const emails = [];
    const duplicateEmails = [];
    for (let i = 0; i < results.length; i++) {
      const { name, lastName, email, numberParallel, parallel } = results[i];

      if (
        name === '' ||
        lastName === '' ||
        email === '' ||
        parallel === '' ||
        numberParallel === ''
      ) {
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'No pueden existir valores vacios en las columnas',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      if (emails.includes(email)) {
        duplicateEmails.push(email);
      } else {
        emails.push(email);
      }
    }
    if (duplicateEmails.length > 0) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: `Los siguientes correos están repetidos ${duplicateEmails.join(
            ',',
          )}`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    for (let i = 0; i < results.length; i++) {
      const element = results[i];
      this.studentsService.createStudent(element);
    }
  }
}
