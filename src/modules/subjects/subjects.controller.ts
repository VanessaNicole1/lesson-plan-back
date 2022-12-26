import { Subject } from './subject.entity';
import { SubjectsService } from './subjects.service';
import { UpdateSubjectDto } from './dto/update-subject-dto';
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
import { Helpers } from 'src/helpers/helpers';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/modules/auth/enums/decorators/roles.decorator';
import { Role } from 'src/modules/auth/enums/role.enum';
import { ValidManager } from '../auth/guards/valid-manager.guard';

@Controller('subject')
export class SubjectsController {
  constructor(private subjectService: SubjectsService) {}

  @Post('upload')
  @UseGuards(AuthGuard('jwt'), ValidManager)
  @Roles(Role.Manager)
  @UseInterceptors(FileInterceptor('file'))
  createSubjects(@UploadedFile() file: Express.Multer.File) {
    const columns = ['name'];
    const data = file.buffer.toString();
    const results = Helpers.validateCsv(data, columns);
    const names = [];
    const duplicateNames = [];
    for (let i = 0; i < results.length; i++) {
      const { name } = results[i];

      if (name === '') {
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'No pueden existir valores vacios en las columnas',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      if (names.includes(name)) {
        duplicateNames.push(name);
      } else {
        names.push(name);
      }
    }
    if (duplicateNames.length > 0) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: `Las siguientes materias están repetidos ${duplicateNames.join(
            ',',
          )}`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    for (let i = 0; i < results.length; i++) {
      const element = results[i];
      this.subjectService.createSubject(element);
    }
  }

  @Get('/:id')
  getSubjectById(@Param('id') id: string): Promise<Subject> {
    return this.subjectService.getSubjectById(id);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), ValidManager)
  @Roles(Role.Manager)
  getAllSubjects() {
    return this.subjectService.getAllSubjects();
  }

  @Delete('/:id')
  @UseGuards(AuthGuard('jwt'), ValidManager)
  @Roles(Role.Manager)
  deleteSubject(@Param('id') id: string) {
    return this.subjectService.deleteSubject(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), ValidManager)
  @Roles(Role.Manager)
  updateSubject(
    @Param('id') id: string,
    @Body() updateSubjectDto: UpdateSubjectDto,
  ) {
    return this.subjectService.updateSubject(id, updateSubjectDto);
  }
}
