import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Manager } from './manager.entity';
import { ManagerController } from './manager.controller';
import { ManagerService } from './manager.service';
import { UserModule } from 'src/user/users.module';
import { RoleModule } from 'src/role/role.module';

@Module({
  imports: [TypeOrmModule.forFeature([Manager]), UserModule, RoleModule],
  controllers: [ManagerController],
  providers: [ManagerService],
})
export class ManagerModule {}
