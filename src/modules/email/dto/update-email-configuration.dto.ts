import { IsNumber, IsString } from "class-validator";

export class UpdateEmailConfigurationDto {
  @IsString()
  host: string

  @IsNumber()
  port: number;

  @IsString()
  user: string;

  @IsString()
  sender: string;

  @IsString()
  password: string;
}
