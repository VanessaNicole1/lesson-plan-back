import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { LessonPlansService } from './lesson-plans.service';
import { CreateLessonPlanDto } from './dto/create-lesson-plan.dto';
import { UpdateLessonPlanDto } from './dto/update-lesson-plan.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('lesson-plans')
export class LessonPlansController {
  constructor(private readonly lessonPlansService: LessonPlansService) {}

  @Get()
  findAll() {
    return this.lessonPlansService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lessonPlansService.findOne(id);
  }

  @Get('schedule/:id')
  findLessonPlanBySchedule(scheduleId: string) {
    return this.lessonPlansService.findLessonPlanBySchedule(scheduleId);
  }

  @Post()
  @UseInterceptors(FilesInterceptor('files', null, {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, callback) => {
        callback(null, `${Date.now()}${extname(file.originalname)}`);
      }
    })
  }))
  create(@Body() createLessonPlanDto: CreateLessonPlanDto, @UploadedFiles() files: Array<Express.Multer.File>) {
    return this.lessonPlansService.create(createLessonPlanDto, files);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLessonPlanDto: UpdateLessonPlanDto) {
    return this.lessonPlansService.update(id, updateLessonPlanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lessonPlansService.remove(id);
  }
}
