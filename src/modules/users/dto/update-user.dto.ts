import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['email', 'roleIds'] as const),
) {
  phoneNumber: number;
  city: string;
  identificationCard: string;
  roles: any[];
}
