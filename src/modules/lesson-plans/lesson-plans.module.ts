import { Module } from '@nestjs/common';
import { LessonPlansService } from './lesson-plans.service';
import { LessonPlansController } from './lesson-plans.controller';
import { LessonPlansRepository } from './lesson-plans.repository';

@Module({
  controllers: [LessonPlansController],
  providers: [LessonPlansService, LessonPlansRepository]
})
export class LessonPlansModule {}
