import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { CommonModule } from './modules/common/common.module';
import { PeriodsModule } from './modules/periods/periods.module';
import { DegreesModule } from './modules/degrees/degrees.module';
import { GradesModule } from './modules/grades/grades.module';
import { InitialProcessModule } from './modules/initial-process/initial-process.module';
import { LessonPlansModule } from './modules/lesson-plans/lesson-plans.module';
import { ManagersModule } from './modules/managers/managers.module';
import { RolesModule } from './modules/roles/roles.module';
import { SchedulesModule } from './modules/schedules/schedules.module';
import { StudentsModule } from './modules/students/students.module';
import { SubjectsModule } from './modules/subjects/subjects.module';
import { TeachersModule } from './modules/teachers/teachers.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    CommonModule,
    UsersModule,
    PeriodsModule,
    DegreesModule,
    GradesModule,
    InitialProcessModule,
    LessonPlansModule,
    ManagersModule,
    RolesModule,
    SchedulesModule,
    StudentsModule,
    SubjectsModule,
    TeachersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
