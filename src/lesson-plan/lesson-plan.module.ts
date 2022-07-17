import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LessonPlan } from './lesson-plan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LessonPlan])],
  controllers: [],
  providers: [],
})
export class LessonPlanModule {}
