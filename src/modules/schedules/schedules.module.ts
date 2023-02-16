import { Module } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { SchedulesController } from './schedules.controller';
import { SchedulesRepository } from './schedules.repository';

@Module({
  controllers: [SchedulesController],
  providers: [SchedulesService, SchedulesRepository]
})
export class SchedulesModule {}
