import { IsDefined, IsEmail, IsString, Length, min } from "class-validator";

export class CreateStudentDto {
  @IsString()
  @IsDefined({ message: 'El nombre del estudiante es requerido'})
  name: string;

  @IsString()
  @IsDefined({ message: 'El apellido del estudiante es requerido'})
  lastName: string;

  @IsEmail()
  @IsDefined({ message: 'El email del estudiante es requerido'})
  email: string;

  @IsString()
  @Length(1, 1, { message: 'El ciclo debe tener un cáracter'})
  @IsDefined({ message: 'El ciclo del estudiante es requerido'})
  numberParallel: string;
  
  @IsString()
  @Length(1, 1, { message: 'El paralelo debe tener un cáracter'})
  @IsDefined({ message: 'El paralelo del estudiante es requerido'})
  parallel: string;
}
