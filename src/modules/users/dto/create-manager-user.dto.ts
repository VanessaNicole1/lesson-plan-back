import { IsArray, IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateManagerUserDto {
  @IsString()
  name: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsArray()
  @IsOptional()
  roleIds?: string[];
}
