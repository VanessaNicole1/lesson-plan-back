import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { CreateTeacherDto } from './create-teacher.dto';
import { i18nValidationMessage } from 'nestjs-i18n';

const baseI18nKey = 'teachers.dtos.validateTeachersDto';
export class ValidateTeachersDto {
  @IsArray()
  @ArrayNotEmpty({
    message: i18nValidationMessage(`${baseI18nKey}.EMPTY_ARRAY`),
  })
  @ValidateNested({ each: true })
  @Type(() => CreateTeacherDto)
  teachers: CreateTeacherDto[];
}
