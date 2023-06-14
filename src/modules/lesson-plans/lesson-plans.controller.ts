import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles, Res, Header, StreamableFile } from '@nestjs/common';
import { LessonPlansService } from './lesson-plans.service';
import { CreateLessonPlanDto } from './dto/create-lesson-plan.dto';
import { UpdateLessonPlanDto } from './dto/update-lesson-plan.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';

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
    return res.sendFile(filename, {root: './uploads'});
  }

  @Post()
  @UseInterceptors(FilesInterceptor('files', null, {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, callback) => {
        const filename = path.parse(file.originalname).name.replace(/\s/g, '') + Date.now();
        const extension = path.parse(file.originalname).ext;
        callback(null, `${filename}${extension}`);
      }
    })
  }))
  create(@Body() createLessonPlanDto: CreateLessonPlanDto, @UploadedFiles() files: Array<Express.Multer.File>) {
    return this.lessonPlansService.create(createLessonPlanDto, files);
  }


  // TODO: Complete this method
  @Patch(':id')
  @UseInterceptors(FilesInterceptor('files', null, {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, callback) => {
        const filename = path.parse(file.originalname).name.replace(/\s/g, '') + Date.now();
        const extension = path.parse(file.originalname).ext;
        callback(null, `${filename}${extension}`);
      }
    })
  }))
  update(@Param('id') id: string, @Body() updateLessonPlanDto: UpdateLessonPlanDto, @UploadedFiles() files: Array<Express.Multer.File>) {
    return this.lessonPlansService.update(id, updateLessonPlanDto, files);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lessonPlansService.remove(id);
  }
}
