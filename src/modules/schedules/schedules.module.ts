import { Module } from '@nestjs/common';
import { SchedulesController } from './schedules.controller';
import { SchedulesService } from './schedules.service';
import { SchedulessRepository } from './schedules.repository';
@Module({
  controllers: [SchedulesController],
  providers: [SchedulesService, SchedulessRepository],
  exports: [SchedulesService]
})
export class SchedulesModule {}
