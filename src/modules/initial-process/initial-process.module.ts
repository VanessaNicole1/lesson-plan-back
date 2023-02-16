import { Module } from '@nestjs/common';
import { InitialProcessService } from './initial-process.service';
import { InitialProcessController } from './initial-process.controller';
import { InitialProcessRepository } from './initial-process.repository';

@Module({
  controllers: [InitialProcessController],
  providers: [InitialProcessService, InitialProcessRepository]
})
export class InitialProcessModule {}
