import { Module } from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { TeachersController } from './teachers.controller';
import { TeachersRepository } from './teachers.repository';

@Module({
  controllers: [TeachersController],
  providers: [TeachersService, TeachersRepository],
  exports: [TeachersService]
})
export class TeachersModule {}
