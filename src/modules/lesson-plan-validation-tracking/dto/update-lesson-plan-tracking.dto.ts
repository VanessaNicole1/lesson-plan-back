import { IsBoolean, IsDefined } from "class-validator";

// TODO: Handle i18n
export class UpdateLessonPlanTrackingDto {
  @IsBoolean()
  @IsDefined()
  isValidated: boolean;

  @IsBoolean()
  @IsDefined()
  isAgree: boolean;
}
