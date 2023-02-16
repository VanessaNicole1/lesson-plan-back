import { Module } from '@nestjs/common';
import { DegreesService } from './degrees.service';
import { DegreesController } from './degrees.controller';
import { DegreesRepository } from './degrees.repository';

@Module({
  controllers: [DegreesController],
  providers: [DegreesService, DegreesRepository]
})
export class DegreesModule {}
