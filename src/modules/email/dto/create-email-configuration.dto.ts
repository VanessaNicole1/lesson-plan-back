import { IsNumber, IsString } from "class-validator";

export class CreateEmailConfigurationDto {
  @IsNumber()
  host: number;

  @IsNumber()
  port: number;

  @IsString()
  user: string;

  @IsString()
  sender: string;

  @IsString()
  password: string;
}
