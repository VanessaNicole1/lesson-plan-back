import { LessonPlanModule } from './../lesson-plan/lesson-plan.module';
import { StudentsModule } from './../students/students.module';
import { StudentLessonPlan } from '../student-lesson-plan/student-lesso-plan-entity';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentLessonPlanService } from './student-lesson-plan.service';
import { StudentLessonPlanController } from './student-lesson-plan.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([StudentLessonPlan]),
    StudentsModule,
    forwardRef(() => LessonPlanModule),
  ],
  controllers: [StudentLessonPlanController],
  providers: [StudentLessonPlanService],
  exports: [StudentLessonPlanService],
})
export class StudentLessonPlanModule {}
