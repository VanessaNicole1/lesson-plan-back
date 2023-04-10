import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { CreateTeacherDto } from './create-teacher.dto';

export class ValidateTeachersDto {
  @IsArray()
  @ArrayNotEmpty({
    message: 'Debe existir al menos un docente para validar',
  })
  @ValidateNested({ each: true })
  @Type(() => CreateTeacherDto)
  teachers: CreateTeacherDto[];
}
