import { DegreesModule } from './../degree/degree.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GradesController } from './grade.controller';
import { Grade } from './grade.entity';
import { GradeService } from './grade.service';

@Module({
  imports: [TypeOrmModule.forFeature([Grade]), DegreesModule],
  controllers: [GradesController],
  providers: [GradeService],
  exports: [GradeService],
})
export class GradesModule {}
