import {
  Body,
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
import { FileInterceptor } from '@nestjs/platform-express';
import { Helpers } from '../../helpers/helpers';
import { TeachersService } from './teachers.service';
import { Teacher } from './teacher.entity';
import { UpdateTeacherDto } from './dto/update-teacher-dto';
import { AuthGuard } from '@nestjs/passport';
import { Role } from 'src/modules/auth/enums/role.enum';
import { Roles } from 'src/modules/auth/enums/decorators/roles.decorator';
import { CreateTeacherDto } from './dto/create-teacher-dto';
import { ValidManager } from '../auth/guards/valid-manager.guard';
import { ValidUser } from '../auth/guards/valid-user.guard';
import { ValidateTeacherFormatDto } from './dto/validate-teacher-format-dto';

@Controller('teacher')
export class TeachersController {
  constructor(private teacherService: TeachersService) {}

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), ValidUser)
  @Roles(Role.Manager, Role.Teacher)
  getTeacherById(@Param('id') id: string): Promise<Teacher> {
    return this.teacherService.getTeacherById(id);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), ValidManager)
  @Roles(Role.Manager)
  getAllTeachers() {
    return this.teacherService.findAll();
  }

  @Delete('/:id')
  @UseGuards(AuthGuard('jwt'), ValidManager)
  @Roles(Role.Manager)
  deleteTeacher(@Param('id') id: string): Promise<void> {
    return this.teacherService.deleteTeacher(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), ValidManager)
  @Roles(Role.Manager)
  updateTeacher(
    @Param('id') id: string,
    @Body() updateTeacherDto: UpdateTeacherDto,
  ) {
    return this.teacherService.updateTeacher(id, updateTeacherDto);
  }

  @Post('upload')
  @UseGuards(AuthGuard('jwt'), ValidManager)
  @Roles(Role.Manager)
  @UseInterceptors(FileInterceptor('file'))
  createTeachers(@UploadedFile() file: Express.Multer.File) {
    const columns = ['name', 'lastName', 'email'];
    const data = file.buffer.toString();
    const results = Helpers.validateCsv(data, columns);
    const emails = [];
    const duplicateEmails = [];
    for (let i = 0; i < results.length; i++) {
      const { name, lastName, email } = results[i];

      if (name === '' || lastName === '' || email === '') {
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
      this.teacherService.createTeacher(element);
    }
  }

  @Post()
  createTeacher(@Body() createTeacherDto: CreateTeacherDto) {
    return this.teacherService.createTeacher(createTeacherDto);
  }

  @Post('validate-format')
  validateFormatOfTheStudentData(
    @Body() validateTeacherFormatDto: ValidateTeacherFormatDto,
  ) {
    return this.teacherService.validateTeacherFormat(validateTeacherFormatDto);
  }
}
