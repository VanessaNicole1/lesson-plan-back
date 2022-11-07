import { Module } from '@nestjs/common';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';
import { Student } from './student.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GradesModule } from 'src/grade/grade.module';
import { UserModule } from 'src/user/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Student]), GradesModule, UserModule],
  controllers: [StudentsController],
  providers: [StudentsService],
  exports: [StudentsService],
})
export class StudentsModule {}
