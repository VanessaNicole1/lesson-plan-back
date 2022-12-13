import { DegreesModule } from './modules/degree/degree.module';
import { Module } from '@nestjs/common';
import { StudentsModule } from './modules/students/students.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeachersModule } from './modules/teachers/teachers.module';
import { SubjectsModule } from './modules/subjects/subjects.module';
import { PeriodsModule } from './modules/period/period.module';
import { GradesModule } from './modules/grade/grade.module';
import { ManagerModule } from './modules/manager/manager.module';
import { LessonPlanModule } from './modules/lesson-plan/lesson-plan.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { UserModule } from './modules/user/users.module';
import { RoleModule } from './modules/role/role.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { ScheduleModule } from './modules/schedule/schedule.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.development.env',
    }),
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
    UserModule,
    RoleModule,
    AuthModule,
    ScheduleModule,
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
