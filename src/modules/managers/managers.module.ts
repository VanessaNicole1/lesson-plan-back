import { Module } from '@nestjs/common';
import { ManagersService } from './managers.service';
import { ManagersController } from './managers.controller';
import { ManagersRepository } from './managers.repository';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [ManagersController],
  providers: [ManagersService, ManagersRepository],
})
export class ManagersModule {}
