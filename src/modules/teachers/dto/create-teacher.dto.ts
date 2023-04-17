import {
  IsDefined,
  IsEmail,
  IsString,
  Length,
  MinLength,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

const baseI18nKey = 'teachers.dtos.createTeacherDto';

export class CreateTeacherDto {
  @IsString({ message: i18nValidationMessage(`${baseI18nKey}.STRING_TNAME`) })
  @MinLength(3, { message: i18nValidationMessage(`${baseI18nKey}.TOO_SHORT_NAME`) })
  @IsDefined({ message: i18nValidationMessage(`${baseI18nKey}.DEFINED_TNAME`) })
  name: string;

  @IsString({ message: i18nValidationMessage(`${baseI18nKey}.STRING_LASTNAME`) })
  @MinLength(3, { message: i18nValidationMessage(`${baseI18nKey}.TOO_SHORT_LASTNAME`) })
  @IsDefined({ message: i18nValidationMessage(`${baseI18nKey}.DEFINED_LASTNAME`) })
  lastName: string;

  @IsEmail({}, { message: i18nValidationMessage(`${baseI18nKey}.INVALID_EMAIL`) })
  @IsDefined({ message: i18nValidationMessage(`${baseI18nKey}.NOT_DEFINED_EMAIL`) })
  email: string;

  @IsString({ message: i18nValidationMessage(`${baseI18nKey}.NOT_STRING_SUBJECT`) })
  @IsDefined({ message: i18nValidationMessage(`${baseI18nKey}.NOT_DEFINED_SUBJECT`) })
  subject: string;

  @IsString({ message: i18nValidationMessage(`${baseI18nKey}.NOT_STRING_NUMBER_PARALLEL`) })
  @Length(1, 2, { message: i18nValidationMessage(`${baseI18nKey}.INVALID_LENGTH_NUMBER_PARALLEL`) })
  @IsDefined({ message:  i18nValidationMessage(`${baseI18nKey}.NOT_DEFINED_NUMBER_PARALLEL`) })
  numberParallel: string;

  @IsString({ message: i18nValidationMessage(`${baseI18nKey}.NOT_STRING_PARALLEL`) })
  @Length(1, 1, { message: i18nValidationMessage(`${baseI18nKey}.INVALID_LENGTH_PARALLEL`) })
  @IsDefined({ message:  i18nValidationMessage(`${baseI18nKey}.NOT_DEFINED_PARALLEL`) })
  parallel: string;
}
