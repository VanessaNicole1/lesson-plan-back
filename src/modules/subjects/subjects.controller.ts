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
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Helpers } from 'src/helpers/helpers';
import { createReadStream } from 'fs';
import csvParser from 'csv-parser';
import { AuthGuard } from '@nestjs/passport';
import { ValidManager } from 'src/modules/auth/valid-manager.guard';
import { Roles } from 'src/modules/auth/enums/decorators/roles.decorator';
import { Role } from 'src/modules/auth/enums/role.enum';

@Controller('subjects')
export class SubjectsController {
  constructor(private subjectService: SubjectsService) {}

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
  createSubject(@UploadedFile() file) {
    const fileName = file.originalname;
    const results = [];
    createReadStream(`files-csv/${fileName}`)
      .pipe(csvParser())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        for (let i = 0; i < results.length; i++) {
          const element = results[i];
          return this.subjectService.createSubject(element);
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
  deleteSubject(@Param('id') id: string): Promise<void> {
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
