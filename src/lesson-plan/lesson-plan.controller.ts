import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateLessonPlanDto } from './dto/create-lesson-plan-dto';
import { UpdateLessonPlanDto } from './dto/update-lesson-plan-dto';
import { LessonPlan } from './lesson-plan.entity';
import { LessonPlanService } from './lesson-plan.service';

@Controller('lessonplan')
export class LessonPlanController {
  constructor(private lessonPlanService: LessonPlanService) {}

  @Get('/:id')
  getLessonPlanById(@Param('id') id: string): Promise<LessonPlan> {
    return this.lessonPlanService.getLessonPlanById(id);
  }

  @Get('/teacher/:teacher_id')
  getAllLessonPlanByTeacher(@Param('teacher_id') teacher_id: string) {
    return this.lessonPlanService.getAllLessonPlanByTeacher(teacher_id);
  }

  @Get('/subject/:subject_id')
  getAllLessonPlanBySubject(@Param('subject_id') subject_id: string) {
    return this.lessonPlanService.getAllLessonPlanBySubject(subject_id);
  }

  @Post()
  createLessonPlan(@Body() createLessonPlanDto: CreateLessonPlanDto) {
    return this.lessonPlanService.createLessonPlan(createLessonPlanDto);
  }

  @Delete('/:id')
  deleteLessonPlan(@Param('id') id: string): Promise<void> {
    return this.lessonPlanService.deleteLessonPlan(id);
  }

  @Put(':id')
  updateLessonPlan(
    @Param('id') id: string,
    @Body() updateLessonPlanDto: UpdateLessonPlanDto,
  ) {
    return this.lessonPlanService.updateLessonPlan(id, updateLessonPlanDto);
  }
}
