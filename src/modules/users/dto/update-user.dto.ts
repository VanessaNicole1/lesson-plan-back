import { OmitType, PartialType } from '@nestjs/mapped-types';
import { IsUUID } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['email'] as const),
) {
  @IsUUID()
  id: string;
}
