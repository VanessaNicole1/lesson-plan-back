import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, ValidateNested } from "class-validator";
import { CreateStudentDto } from "./create-student.dto";

export class ValidateStudentsDto {
  @IsArray()
  @ArrayNotEmpty({ message: 'Debe existir al menos un estudiante para validar'})
  @ValidateNested({ each: true })
  @Type(() => CreateStudentDto)
  students: CreateStudentDto[]
}
