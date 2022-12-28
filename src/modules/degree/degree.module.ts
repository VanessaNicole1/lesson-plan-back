import { PeriodsModule } from './../period/period.module';
import { ManagerModule } from './../manager/manager.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Degree } from './degree.entity';
import { DegreesController } from './degree.controller';
import { DegreeService } from './degree.service';

@Module({
  imports: [TypeOrmModule.forFeature([Degree]), ManagerModule, PeriodsModule],
  controllers: [DegreesController],
  providers: [DegreeService],
  exports: [DegreeService],
})
export class DegreesModule {}
