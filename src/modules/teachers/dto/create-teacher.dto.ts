import { IsEmail, IsString, ValidateNested } from "class-validator";
import { CreateSubjectDto } from "../../subjects/dto/create-subject.dto";

export class CreateTeacherDto {
  @IsString()
  name: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  numberParallel: string;

  @IsString()
  parallel: string;

  @IsString()
  subject: string;
}
