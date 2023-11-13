// @ts-nocheck
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
  BadRequestException,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { LessonPlansService } from './lesson-plans.service';
import { CreateLessonPlanDto } from './dto/create-lesson-plan.dto';
import { UpdateLessonPlanDto } from './dto/update-lesson-plan.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { DeleteResourceDto } from './dto/delete-resource.dto';
import { LessonPlanReportDto } from '../common/dto/lesson-plan-report.dto';
import { FilterLessonPlanDTO } from './dto/filter-lesson-plan-dto';
import { CreateRemedialPlanDto } from './dto/create-remedial-plan.dto';
import { UpdateLessonPlanTrackingDto } from '../lesson-plan-validation-tracking/dto/update-lesson-plan-tracking.dto';
import { AuthenticationGuard } from '../common/guards/authentication.guard';
import { ValidManager } from '../../utils/guards/valid-manager.guard';
import { Roles } from '../../utils/decorators/roles.decorator';
import { Role } from '../../utils/enums/roles.enum';

@Controller('lesson-plans')
export class LessonPlansController {
  constructor(private readonly lessonPlansService: LessonPlansService) {}

  @Get()
  findAll(@Query() filterLessonPlanDto: FilterLessonPlanDTO) {
    return this.lessonPlansService.findAll(filterLessonPlanDto);
  }

  @Get('all-types')
  @UseGuards(AuthenticationGuard, ValidManager)
  @Roles(Role.Manager)
  findAllLessonPlanTypes() {
    return this.lessonPlansService.findAllLessonPlanTypes();
  }

  @Get('report/:userId')
  @UseGuards(AuthenticationGuard)
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

    if (!report) {
      throw new BadRequestException();
    }

    const buffer = Buffer.from(report.buffer);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Length': report.length,
      'Content-Disposition': 'attachment; filename=generated.pdf',
    });

    res.send(buffer);
  }

  @Get(':id')
  @UseGuards(AuthenticationGuard)
  async findOne(@Param('id') id: string) {
    return this.lessonPlansService.findOne(id);
  }

  @Get('period/:id')
  @UseGuards(AuthenticationGuard)
  async findOneWithPeriod(@Param('id') id: string) {
    return this.lessonPlansService.findOneWithPeriod(id);
  }

  @Get('schedule/:scheduleId')
  @UseGuards(AuthenticationGuard)
  findLessonPlanBySchedule(@Param('scheduleId') scheduleId: string) {
    return this.lessonPlansService.findLessonPlanBySchedule(scheduleId);
  }

  @Get('resource/:filename')
  @UseGuards(AuthenticationGuard)
  uploadResource(@Param('filename') filename, @Res() res) {
    return res.sendFile(filename, { root: './uploads' });
  }

  @Get('remedial-report/:filename')
  @UseGuards(AuthenticationGuard)
  uploadRemedialReport(@Param('filename') filename, @Res() res) {
    return res.sendFile(filename, { root: './remedials' });
  }

  @Get('manuals/:filename')
  @UseGuards(AuthenticationGuard)
  uploadManual(@Param('filename') filename, @Res() res) {
    return res.sendFile(filename, { root: './manuals' });
  }

  @Post()
  @UseGuards(AuthenticationGuard)
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
  @UseGuards(AuthenticationGuard)
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
  @UseGuards(AuthenticationGuard)
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
  @UseGuards(AuthenticationGuard)
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

  @Get('remedial/report/:lessonPlanId')
  @UseGuards(AuthenticationGuard)
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'attachment; filename="report.pdf"')
  async generateRemedialLessonPlanReport(
    @Param('lessonPlanId') lessonPlanId: string,
    @Res() res: Response,
  ) {
    const report =
      await this.lessonPlansService.generateRemedialLessonPlanReport(
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

  @Post('remedial-plan')
  @UseGuards(AuthenticationGuard)
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
  createRemedialPlan(
    @Body() createRemedialPlanDto: CreateRemedialPlanDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const currentStudents = createRemedialPlanDto.students
      .split(',')
      .map(String);
    createRemedialPlanDto = {
      ...createRemedialPlanDto,
      students: currentStudents,
    };
    return this.lessonPlansService.createRemedialPlan(
      createRemedialPlanDto,
      files,
    );
  }

  @Post('signed-report-by-teacher/:remedialPlanId')
  @UseGuards(AuthenticationGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './remedials',
        filename: (req, file, callback) => {
          const filename =
            path.parse(file.originalname).name.replace(/\s/g, '') + Date.now();
          const extension = path.parse(file.originalname).ext;
          callback(null, `${filename}${extension}`);
        },
      }),
    }),
  )
  uploadSignedReportByTeacher(
    @Param('remedialPlanId') remedialPlanId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.lessonPlansService.uploadSignedReportByTeacher(
      remedialPlanId,
      file,
    );
  }

  @Post('signed-report-by-manager/:remedialPlanId')
  @UseGuards(AuthenticationGuard, ValidManager)
  @Roles(Role.Manager)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './remedials',
        filename: (req, file, callback) => {
          const filename =
            path.parse(file.originalname).name.replace(/\s/g, '') + Date.now();
          const extension = path.parse(file.originalname).ext;
          callback(null, `${filename}${extension}`);
        },
      }),
    }),
  )
  uploadSignedReportByManager(
    @Param('remedialPlanId') remedialPlanId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.lessonPlansService.uploadSignedReportByManager(
      remedialPlanId,
      file,
    );
  }

  @Patch(':id/accept')
  @UseGuards(AuthenticationGuard)
  acceptRemedialLessonPlanByStudent(
    @Param('id') id: string,
    @Body() updateLessonPlanTrackingDto: UpdateLessonPlanTrackingDto,
  ) {
    return this.lessonPlansService.acceptRemedialLessonPlanByStudent(
      id,
      updateLessonPlanTrackingDto,
    );
  }
}
