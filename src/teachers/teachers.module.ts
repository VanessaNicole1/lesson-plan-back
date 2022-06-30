import { TeachersService } from './teachers.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Teacher } from './teacher.entity';
import { TeachersController } from './teachers.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Teacher])],
  controllers: [TeachersController],
  providers: [TeachersService],
})
export class TeachersModule {}
