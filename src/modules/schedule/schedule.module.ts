import { SubjectsModule } from './../subjects/subjects.module';
import { TeachersModule } from 'src/modules/teachers/teachers.module';
import { GradesModule } from 'src/modules/grade/grade.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleController } from './schedule.controller';
import { Schedule } from './schedule.entity';
import { ScheduleService } from './schedule.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Schedule]),
    GradesModule,
    TeachersModule,
    SubjectsModule,
  ],
  controllers: [ScheduleController],
  providers: [ScheduleService],
  exports: [ScheduleService],
})
export class ScheduleModule {}
