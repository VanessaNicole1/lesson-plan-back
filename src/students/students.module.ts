import { Module } from '@nestjs/common';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';
import { Student } from './student.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GradesModule } from 'src/grade/grade.module';

@Module({
  imports: [TypeOrmModule.forFeature([Student]), GradesModule],
  controllers: [StudentsController],
  providers: [StudentsService],
  exports: [StudentsService],
})
export class StudentsModule {}
