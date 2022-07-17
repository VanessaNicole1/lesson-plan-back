import { DegreesModule } from './degree/degree.module';
import { Module } from '@nestjs/common';
import { StudentsModule } from './students/students.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeachersModule } from './teachers/teachers.module';
import { SubjectsModule } from './subjects/subjects.module';
import { PeriodsModule } from './period/period.module';
import { GradesModule } from './grade/grade.module';
import { ManagerModule } from './manager/manager.module';
import { LessonPlanModule } from './lesson-plan/lesson-plan.module';

@Module({
  imports: [
    StudentsModule,
    TeachersModule,
    SubjectsModule,
    PeriodsModule,
    DegreesModule,
    GradesModule,
    ManagerModule,
    LessonPlanModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'lesson-plan',
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
})
export class AppModule {}
