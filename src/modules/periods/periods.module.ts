import { Module } from '@nestjs/common';
import { PeriodsService } from './periods.service';
import { PeriodsController } from './periods.controller';
import { PeriodsRepository } from './periods.repository';
import { TeachersModule } from '../teachers/teachers.module';
import { SubjectsModule } from '../subjects/subjects.module';

@Module({
  imports: [TeachersModule, SubjectsModule],
  controllers: [PeriodsController],
  providers: [PeriodsService, PeriodsRepository],
  exports: [PeriodsService]
})
export class PeriodsModule {}
