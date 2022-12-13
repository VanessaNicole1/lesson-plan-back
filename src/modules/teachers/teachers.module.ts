import { TeachersService } from './teachers.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Teacher } from './teacher.entity';
import { TeachersController } from './teachers.controller';
import { UserModule } from 'src/modules/user/users.module';
import { RoleModule } from 'src/modules/role/role.module';

@Module({
  imports: [TypeOrmModule.forFeature([Teacher]), UserModule, RoleModule],
  controllers: [TeachersController],
  providers: [TeachersService],
  exports: [TeachersService],
})
export class TeachersModule {}