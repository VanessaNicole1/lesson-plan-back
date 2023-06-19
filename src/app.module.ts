import * as path from 'path';
import { Module } from '@nestjs/common';
import { AcceptLanguageResolver, I18nModule } from 'nestjs-i18n';
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
import { StudentsModule } from './modules/students/students.module';
import { SubjectsModule } from './modules/subjects/subjects.module';
import { TeachersModule } from './modules/teachers/teachers.module';
import { AuthModule } from './modules/auth/auth.module';
import { RegisterConfigModule } from './modules/register-config/register-config.module';
import { SchedulesModule } from './modules/schedules/schedules.module';

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '/i18n'),
        watch: true
      },
      resolvers: [
        AcceptLanguageResolver
      ]
    }),
    CommonModule,
    SchedulesModule,
    UsersModule,
    PeriodsModule,
    DegreesModule,
    GradesModule,
    InitialProcessModule,
    LessonPlansModule,
    ManagersModule,
    RolesModule,
    StudentsModule,
    SubjectsModule,
    TeachersModule,
    AuthModule,
    RegisterConfigModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
