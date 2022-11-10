import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleModule } from 'src/role/role.module';
import { User } from './user-entity';
import { UserService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), RoleModule],
  controllers: [],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
