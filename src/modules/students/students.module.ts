import { Module } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { StudentsRepository } from './students.repository';
import { PeriodsModule } from '../periods/periods.module';
import { LessonPlanValidationTrackingModule } from '../lesson-plan-validation-tracking/lesson-plan-tracking.module';
import { UsersModule } from '../users/users.module';
import { LessonPlansModule } from '../lesson-plans/lesson-plans.module';

@Module({
  imports: [PeriodsModule, UsersModule, LessonPlanValidationTrackingModule, LessonPlansModule],
  controllers: [StudentsController],
  providers: [StudentsService, StudentsRepository],
  exports: [StudentsService],
})
export class StudentsModule {}
