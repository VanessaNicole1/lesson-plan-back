import {
  IsDefined,
  IsEmail,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

export class CreateTeacherDto {
  @IsString({ message: 'Solo caractéres son aceptados en el nombre' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 carácteres' })
  @IsDefined({ message: 'El nombre del docente es requerido' })
  name: string;

  @IsString({ message: 'Solo caractéres son aceptados en el apellido' })
  @MinLength(3, { message: 'El apellido debe tener al menos 3 carácteres' })
  @IsDefined({ message: 'El apellido del docente es requerido' })
  lastName: string;

  @IsEmail({}, { message: 'El email debe ser un correo válido' })
  @IsDefined({ message: 'El email del docente es requerido' })
  email: string;

  @IsString({ message: 'Solo caractéres son aceptados en la materia' })
  @IsDefined({ message: 'La materia del docente es requerida' })
  subject: string;

  @IsString({ message: 'Solo cáractereres son aceptados en el ciclo' })
  @Length(1, 2, { message: 'El ciclo debe tener un cáracter' })
  @IsDefined({ message: 'El ciclo del docente es requerido' })
  numberParallel: string;

  @IsString({ message: 'Solo cáractereres son aceptados en el paralelo' })
  @Length(1, 1, { message: 'El paralelo debe tener un cáracter' })
  @IsDefined({ message: 'El paralelo del docente es requerido' })
  parallel: string;
}
