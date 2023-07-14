import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  Res,
} from '@nestjs/common';
import { LessonPlansService } from './lesson-plans.service';
import { CreateLessonPlanDto } from './dto/create-lesson-plan.dto';
import { UpdateLessonPlanDto } from './dto/update-lesson-plan.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { DeleteResourceDto } from './dto/delete-resource.dto';

@Controller('lesson-plans')
export class LessonPlansController {
  constructor(private readonly lessonPlansService: LessonPlansService) {}

  @Get()
  findAll() {
    return this.lessonPlansService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.lessonPlansService.findOne(id);
  }

  @Get('schedule/:scheduleId')
  findLessonPlanBySchedule(@Param('scheduleId') scheduleId: string) {
    return this.lessonPlansService.findLessonPlanBySchedule(scheduleId);
  }

  @Get('resource/:filename')
  uploadResource(@Param('filename') filename, @Res() res) {
    return res.sendFile(filename, { root: './uploads' });
  }

  @Post()
  @UseInterceptors(
    FilesInterceptor('files', null, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const filename =
            path.parse(file.originalname).name.replace(/\s/g, '') + Date.now();
          const extension = path.parse(file.originalname).ext;
          callback(null, `${filename}${extension}`);
        },
      }),
    }),
  )
  create(
    @Body() createLessonPlanDto: CreateLessonPlanDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const currentStudents = createLessonPlanDto.students.split(',').map(String);
    createLessonPlanDto = {
      ...createLessonPlanDto,
      students: currentStudents,
    };
    return this.lessonPlansService.create(createLessonPlanDto, files);
  }

  // TODO: Complete this method
  @Patch(':id')
  @UseInterceptors(
    FilesInterceptor('files', null, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const filename =
            path.parse(file.originalname).name.replace(/\s/g, '') + Date.now();
          const extension = path.parse(file.originalname).ext;
          callback(null, `${filename}${extension}`);
        },
      }),
    }),
  )
  update(
    @Param('id') id: string,
    @Body() updateLessonPlanDto: UpdateLessonPlanDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const currentStudents = updateLessonPlanDto.students.split(',').map(String);
    updateLessonPlanDto = {
      ...updateLessonPlanDto,
      students: currentStudents,
    };
    return this.lessonPlansService.update(id, updateLessonPlanDto, files);
  }

  @Post('resource/:id')
  async removeResource(
    @Param('id') id: string,
    @Body() deleteResourceDto: DeleteResourceDto,
  ) {
    return await this.lessonPlansService.removeResource(id, deleteResourceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lessonPlansService.remove(id);
  }
}
