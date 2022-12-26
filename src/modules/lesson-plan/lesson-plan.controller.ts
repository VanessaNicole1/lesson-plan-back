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
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { Role } from 'src/modules/auth/enums/role.enum';
import { Roles } from 'src/modules/auth/roles.decorator';
import { ValidManager } from '../auth/guards/valid-manager.guard';
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

  @Post('/:id')
  @UseGuards(AuthGuard('jwt'))
  createLessonPlan(
    @Body() createLessonPlanDto: CreateLessonPlanDto,
    @Param('id') id: string,
    @GetUser() user,
  ) {
    return this.lessonPlanService.createLessonPlan(
      createLessonPlanDto,
      id,
      user,
    );
  }

  @Put(':id')
  updateLessonPlan(
    @Param('id') id: string,
    @Body() updateLessonPlanDto: UpdateLessonPlanDto,
  ) {
    return this.lessonPlanService.updateLessonPlan(id, updateLessonPlanDto);
  }

  @Delete('/:id')
  deleteLessonPlan(@Param('id') id: string): Promise<void> {
    return this.lessonPlanService.deleteLessonPlan(id);
  }
}
