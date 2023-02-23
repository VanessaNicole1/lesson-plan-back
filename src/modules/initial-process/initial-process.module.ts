import { Module } from '@nestjs/common';
import { InitialProcessService } from './initial-process.service';
import { InitialProcessController } from './initial-process.controller';
import { InitialProcessRepository } from './initial-process.repository';
import { PeriodsModule } from '../periods/periods.module';
import { UsersModule } from '../users/users.module';
import { StudentsModule } from '../students/students.module';
import { TeachersModule } from '../teachers/teachers.module';
import { GradesModule } from '../grades/grades.module';

@Module({
  imports: [
    PeriodsModule,
    UsersModule,
    StudentsModule,
    TeachersModule,
    GradesModule
  ],
  controllers: [InitialProcessController],
  providers: [InitialProcessService, InitialProcessRepository]
})
export class InitialProcessModule {}
