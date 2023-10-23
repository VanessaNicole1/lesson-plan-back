import { IsOptional, IsString, IsUUID } from 'class-validator';

export class GetLessonPlansDto {
  @IsOptional()
  isValidated?: string;

  @IsUUID()
  userId?: string;

  // @IsUUID()
  periodId?: string;
}
