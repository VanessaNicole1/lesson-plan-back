import { Module } from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { TeachersController } from './teachers.controller';
import { TeachersRepository } from './teachers.repository';
import { UsersModule } from '../users/users.module';
import { PeriodsModule } from '../periods/periods.module';

@Module({
  imports: [
    UsersModule,
    PeriodsModule
  ],
  controllers: [TeachersController],
  providers: [TeachersService, TeachersRepository],
  exports: [TeachersService]
})
export class TeachersModule {}
