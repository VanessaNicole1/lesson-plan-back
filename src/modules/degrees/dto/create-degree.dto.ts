import { IsString } from "class-validator";

export class CreateDegreeDto {
  @IsString()
  name: string
}
