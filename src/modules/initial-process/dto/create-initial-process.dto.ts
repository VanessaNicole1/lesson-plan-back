import { IsDefined, ValidateNested } from 'class-validator';
import { CreateDegreeDto } from '../../degrees/dto/create-degree.dto';
import { CreateManagerDto } from '../../managers/dto/create-manager.dto';
import { CreatePeriodDto } from '../../periods/dto/create-period.dto';
import { CreateStudentDto } from '../../students/dto/create-student.dto';
import { CreateTeacherDto } from '../../teachers/dto/create-teacher.dto';

export class CreateInitialProcessDto {
  @ValidateNested()
  @IsDefined({ message: 'El periodo es requerido.' })
  period: CreatePeriodDto;

  @ValidateNested()
  @IsDefined({ message: 'El director de carrera es requerido.' })
  manager: CreateManagerDto;

  @ValidateNested()
  @IsDefined({ message: 'La carrera es requerida.' })
  degree: CreateDegreeDto;

  @ValidateNested({ each: true })
  @IsDefined({ message: 'Los estudiantes son requeridos.' })
  students: CreateStudentDto[];

  @ValidateNested({ each: true })
  @IsDefined({ message: 'Los docentes son requeridos.' })
  teachers: CreateTeacherDto[];
}
