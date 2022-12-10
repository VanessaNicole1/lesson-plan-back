import { ValidManager } from './../auth/valid-manager.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Role } from 'src/modules/auth/enums/role.enum';
import { Roles } from 'src/modules/auth/roles.decorator';
import { ValidUser } from 'src/modules/auth/valid-user.guard';
import { CreateLessonPlanDto } from './dto/create-lesson-plan-dto';
import { UpdateLessonPlanDto } from './dto/update-lesson-plan-dto';
import { LessonPlan } from './lesson-plan.entity';
import { LessonPlanService } from './lesson-plan.service';

@Controller('lessonplan')
export class LessonPlanController {
  constructor(private lessonPlanService: LessonPlanService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'), ValidManager)
  @Roles(Role.Manager)
  getLessonPlans() {
    return this.lessonPlanService.findAll();
  }

  @Get('/:id')
  getLessonPlanById(@Param('id') id: string): Promise<LessonPlan> {
    return this.lessonPlanService.getLessonPlanById(id);
  }

  @Get('/teacher/:teacher_id')
  @UseGuards(AuthGuard('jwt'), ValidUser)
  @Roles(Role.Manager, Role.Teacher)
  getAllLessonPlanByTeacher(@Param('teacher_id') teacher_id: string) {
    return this.lessonPlanService.getAllLessonPlanByTeacher(teacher_id);
  }

  @Get('/subject/:subject_id')
  getAllLessonPlanBySubject(@Param('subject_id') subject_id: string) {
    return this.lessonPlanService.getAllLessonPlanBySubject(subject_id);
  }

  @Post(':id')
  @UseGuards(AuthGuard('jwt'))
  createLessonPlan(
    @Body() createLessonPlanDto: CreateLessonPlanDto,
    @Param('id') id,
  ) {
    return this.lessonPlanService.createLessonPlan(createLessonPlanDto, id);
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
