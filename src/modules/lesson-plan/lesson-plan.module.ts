import { StudentLessonPlanModule } from './../student-lesson-plan/student-lesson-plan.module';
import { ScheduleModule } from './../schedule/schedule.module';
import { TeachersModule } from './../teachers/teachers.module';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LessonPlanController } from './lesson-plan.controller';
import { LessonPlan } from './lesson-plan.entity';
import { LessonPlanService } from './lesson-plan.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([LessonPlan]),
    TeachersModule,
    ScheduleModule,
    forwardRef(() => StudentLessonPlanModule),
  ],
  controllers: [LessonPlanController],
  providers: [LessonPlanService],
  exports: [LessonPlanService],
})
export class LessonPlanModule {}
