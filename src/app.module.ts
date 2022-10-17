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
import { UsersModule } from './users/users.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: 'smtp.example.com',
          port: 587,
          secure: false, // upgrade later with STARTTLS
          auth: {
            user: 'username',
            pass: 'password',
          },
        },
        defaults: {
          from: '"nest-modules" <modules@nestjs.com>',
        },
        template: {
          dir: process.cwd() + '/templates/',
          adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
          options: {
            strict: true,
          },
        },
      }),
    }),
    StudentsModule,
    HandlebarsAdapter,
    TeachersModule,
    SubjectsModule,
    PeriodsModule,
    DegreesModule,
    GradesModule,
    ManagerModule,
    LessonPlanModule,
    UsersModule,
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
    UsersModule,
  ],
})
export class AppModule {}
