import { IsDateString, IsNotEmpty } from "class-validator";

export class CreatePeriodDto {
  @IsNotEmpty()
  @IsDateString()
  startDate: Date;

  @IsNotEmpty()
  @IsDateString()
  endDate: Date;
}
