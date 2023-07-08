import { Module, forwardRef } from '@nestjs/common';
import { SchedulesController } from './schedules.controller';
import { SchedulesService } from './schedules.service';
import { SchedulesRepository } from './schedules.repository';
import { TeachersModule } from '../teachers/teachers.module';
@Module({
  imports: [
    forwardRef(() => TeachersModule)
  ],
  controllers: [SchedulesController],
  providers: [SchedulesService, SchedulesRepository],
  exports: [SchedulesService]
})
export class SchedulesModule {}
