import { Module } from '@nestjs/common';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';
import { Student } from './student.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GradesModule } from 'src/modules/grade/grade.module';
import { UserModule } from 'src/modules/user/users.module';
import { RoleModule } from 'src/modules/role/role.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Student]),
    GradesModule,
    UserModule,
    RoleModule,
  ],
  controllers: [StudentsController],
  providers: [StudentsService],
  exports: [StudentsService],
})
export class StudentsModule {}
