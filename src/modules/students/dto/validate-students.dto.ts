import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, ValidateNested } from "class-validator";
import { CreateStudentDto } from "./create-student.dto";
import { i18nValidationMessage } from "nestjs-i18n";

const baseI18nKey = 'students.dtos.validateStudentsDto';

export class ValidateStudentsDto {
  @IsArray()
  @ArrayNotEmpty({
    message: i18nValidationMessage(`${baseI18nKey}.EMPTY_ARRAY`),
  })
  @ValidateNested({ each: true })
  @Type(() => CreateStudentDto)
  students: CreateStudentDto[]
}
