import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateLessonPlanDto } from './dto/create-lesson-plan-dto';
import { UpdateLessonPlanDto } from './dto/update-lesson-plan-dto';
import { LessonPlan } from './lesson-plan.entity';
import { LessonPlanService } from './lesson-plan.service';

@Controller('lessonplan')
export class StudentsController {
  constructor(private lessonPlanService: LessonPlanService) {}

  @Get('/:id')
  getLessonPlanById(@Param('id') id: string): Promise<LessonPlan> {
    return this.lessonPlanService.getLessonPlanById(id);
  }

  @Post()
  createLessonPlan(@Body() createLessonPlanDto: CreateLessonPlanDto) {
    return this.lessonPlanService.createLessonPlan(createLessonPlanDto);
  }

  @Delete('/:id')
  deleteLessonPlan(@Param('id') id: string): Promise<void> {
    return this.lessonPlanService.deleteLessonPlan(id);
  }

  updateLessonPlan(updateLessonPlanDto: UpdateLessonPlanDto) {
    return this.lessonPlanService.updateLessonPlan(updateLessonPlanDto);
  }
}
