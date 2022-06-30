import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Degree } from './degree.entity';
import { DegreesController } from './degree.controller';
import { DegreeService } from './degree.service';

@Module({
  imports: [TypeOrmModule.forFeature([Degree])],
  controllers: [DegreesController],
  providers: [DegreeService],
})
export class DegreesModule {}
