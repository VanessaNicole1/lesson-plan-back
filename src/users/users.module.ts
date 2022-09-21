import { Module } from '@nestjs/common';
import { StudentsModule } from 'src/students/students.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [StudentsModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
