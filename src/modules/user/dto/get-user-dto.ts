import { IsNotEmpty } from 'class-validator';
export class GetUserDto {
  @IsNotEmpty()
  id: string;
}
