import { IsString, MinLength } from 'class-validator';

// TODO: Apply i18n and check if it is necessary to apply a validator for strong password.
export class UpdatePasswordDto {
  @IsString()
  @MinLength(5)
  updatedPassword: string;
}
