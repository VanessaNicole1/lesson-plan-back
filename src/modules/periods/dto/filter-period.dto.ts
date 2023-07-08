import { IsOptional, IsString } from 'class-validator';

export class FilterPeriodDto {
  @IsOptional()
  @IsString()
  isActive?: string;

  @IsOptional()
  @IsString()
  idManagerUser?: string;
}
