import { ManagerModule } from './../manager/manager.module';
import { SubjectsModule } from './../subjects/subjects.module';
import { TeachersModule } from 'src/modules/teachers/teachers.module';
import { StudentsModule } from './../students/students.module';
import { DegreesModule } from './../degree/degree.module';
import { PeriodsModule } from './../period/period.module';
import { InitialProcessService } from './initial-process.service';
import { Module } from '@nestjs/common';
import { InitialProcessController } from './initial-process.controller';
import { GradesModule } from '../grade/grade.module';
@Module({
  imports: [
    PeriodsModule,
    DegreesModule,
    StudentsModule,
    TeachersModule,
    SubjectsModule,
    ManagerModule,
    GradesModule,
  ],
  controllers: [InitialProcessController],
  providers: [InitialProcessService],
  exports: [],
})
export class InitialProcessModule {}
