import { Module } from '@nestjs/common';
import { GradesService } from './grades.service';
import { GradesController } from './grades.controller';
import { GradesRepository } from './grades.repository';

@Module({
  controllers: [GradesController],
  providers: [GradesService, GradesRepository],
  exports: [GradesService]
})
export class GradesModule {}
