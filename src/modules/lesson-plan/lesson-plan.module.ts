import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LessonPlanController } from './lesson-plan.controller';
import { LessonPlan } from './lesson-plan.entity';
import { LessonPlanService } from './lesson-plan.service';

@Module({
  imports: [TypeOrmModule.forFeature([LessonPlan])],
  controllers: [LessonPlanController],
  providers: [LessonPlanService],
})
export class LessonPlanModule {}
