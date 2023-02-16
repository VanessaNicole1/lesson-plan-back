import { Module } from '@nestjs/common';
import { PeriodsService } from './periods.service';
import { PeriodsController } from './periods.controller';
import { PeriodsRepository } from './periods.repository';

@Module({
  controllers: [PeriodsController],
  providers: [PeriodsService, PeriodsRepository]
})
export class PeriodsModule {}
