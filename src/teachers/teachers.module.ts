import { TeachersService } from './teachers.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Teacher } from './teacher.entity';
import { TeachersController } from './teachers.controller';
import { TeacherToSubject } from './teacherToSubject.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Teacher, TeacherToSubject])],
  controllers: [TeachersController],
  providers: [TeachersService],
  exports: [TeachersService],
})
export class TeachersModule {}
