import { Module } from '@nestjs/common';
import { ManagersService } from './managers.service';
import { ManagersController } from './managers.controller';
import { ManagersRepository } from './managers.repository';

@Module({
  controllers: [ManagersController],
  providers: [ManagersService, ManagersRepository],
  exports: [ManagersService]
})
export class ManagersModule {}
