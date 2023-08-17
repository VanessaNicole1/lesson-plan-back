import { IsOptional, IsString } from 'class-validator';
import { Role } from '../../../utils/enums/roles.enum';

export class FilterUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  roleType?: string;
}
