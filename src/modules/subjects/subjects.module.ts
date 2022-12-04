import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Teacher } from 'src/modules/teachers/teacher.entity';
import { TeachersModule } from 'src/modules/teachers/teachers.module';
import { Subject } from './subject.entity';
import { SubjectsController } from './subjects.controller';
import { SubjectsService } from './subjects.service';

@Module({
  imports: [TypeOrmModule.forFeature([Subject, Teacher]), TeachersModule],
  controllers: [SubjectsController],
  providers: [SubjectsService],
})
export class SubjectsModule {}
