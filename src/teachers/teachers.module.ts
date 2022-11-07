import { TeachersService } from './teachers.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Teacher } from './teacher.entity';
import { TeachersController } from './teachers.controller';
import { UserModule } from 'src/user/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Teacher]), UserModule],
  controllers: [TeachersController],
  providers: [TeachersService],
  exports: [TeachersService],
})
export class TeachersModule {}
