import { Module } from '@nestjs/common';
import { LessonPlansService } from './lesson-plans.service';
import { LessonPlansController } from './lesson-plans.controller';
import { LessonPlansRepository } from './lesson-plans.repository';
import { SchedulesModule } from '../schedules/schedules.module';

@Module({
  imports: [
    SchedulesModule
  ],
  controllers: [LessonPlansController],
  providers: [LessonPlansService, LessonPlansRepository]
})
export class LessonPlansModule {}
