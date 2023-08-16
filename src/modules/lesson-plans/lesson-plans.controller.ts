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
  Query,
  Header,
} from '@nestjs/common';
import { Response } from 'express';
import { LessonPlansService } from './lesson-plans.service';
import { CreateLessonPlanDto } from './dto/create-lesson-plan.dto';
import { UpdateLessonPlanDto } from './dto/update-lesson-plan.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { DeleteResourceDto } from './dto/delete-resource.dto';
import { LessonPlanReportDto } from '../common/dto/lesson-plan-report.dto';

@Controller('lesson-plans')
export class LessonPlansController {
  constructor(private readonly lessonPlansService: LessonPlansService) {}

  @Get()
  findAll() {
    return this.lessonPlansService.findAll();
  }

  @Get('report/:userId')
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'attachment; filename="report.pdf"')
  async generateLessonPlanReportForTeacher(
    @Param('userId') userId: string,
    @Query() lessonPlanReportDto: LessonPlanReportDto,
    @Res() res: Response,
  ) {
    const report =
      await this.lessonPlansService.generateTeacherLessonPlanReport(
        userId,
        lessonPlanReportDto,
      );
    const buffer = Buffer.from(report.buffer);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Length': report.length,
      'Content-Disposition': 'attachment; filename=generated.pdf',
    });

    res.send(buffer);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.lessonPlansService.findOne(id);
  }

  @Get('period/:id')
  async findOneWithPeriod(@Param('id') id: string) {
    return this.lessonPlansService.findOneWithPeriod(id);
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

  @Get('unique-report/:lessonPlanId')
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'attachment; filename="report.pdf"')
  async generateLessonPlanReport(
    @Param('lessonPlanId') lessonPlanId: string,
    @Res() res: Response,
  ) {
    const report = await this.lessonPlansService.generateLessonPlanReport(
      lessonPlanId,
    );
    const buffer = Buffer.from(report.buffer);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Length': report.length,
      'Content-Disposition': 'attachment; filename=generated.pdf',
    });

    res.send(buffer);
  }
}
