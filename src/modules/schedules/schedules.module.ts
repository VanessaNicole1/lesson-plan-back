import { Module, forwardRef } from '@nestjs/common';
import { SchedulesController } from './schedules.controller';
import { SchedulesService } from './schedules.service';
import { SchedulesRepository } from './schedules.repository';
import { TeachersModule } from '../teachers/teachers.module';
import { UsersModule } from '../users/users.module';
@Module({
  imports: [forwardRef(() => TeachersModule), UsersModule],
  controllers: [SchedulesController],
  providers: [SchedulesService, SchedulesRepository],
  exports: [SchedulesService],
})
export class SchedulesModule {}
