import { IsBoolean, IsDefined, IsOptional, IsString } from "class-validator";

export class UpdateLessonPlanTrackingDto {
  @IsBoolean()
  @IsDefined()
  isValidated: boolean;

  @IsBoolean()
  @IsDefined()
  isAgree: boolean;

  @IsOptional()
  @IsString()
  comment: string;
}
