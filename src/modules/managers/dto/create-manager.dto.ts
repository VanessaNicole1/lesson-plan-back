import { IsUUID } from "class-validator";

export class CreateManagerDto {
  @IsUUID()
  userId: string
}
