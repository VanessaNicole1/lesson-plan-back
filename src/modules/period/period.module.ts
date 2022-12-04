import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Period } from './period.entity';
import { PeriodsService } from './period.service';
import { PeriodsController } from './period.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Period])],
  controllers: [PeriodsController],
  providers: [PeriodsService],
})
export class PeriodsModule {}
