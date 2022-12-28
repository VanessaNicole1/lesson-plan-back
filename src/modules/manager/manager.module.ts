import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Manager } from './manager.entity';
import { ManagerController } from './manager.controller';
import { ManagerService } from './manager.service';
import { UserModule } from 'src/modules/user/users.module';
import { RoleModule } from 'src/modules/role/role.module';

@Module({
  imports: [TypeOrmModule.forFeature([Manager]), UserModule, RoleModule],
  controllers: [ManagerController],
  providers: [ManagerService],
  exports: [ManagerService],
})
export class ManagerModule {}
