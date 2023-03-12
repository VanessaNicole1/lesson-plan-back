import { Role } from '../../../utils/enums/roles.enum';

export class FilterUserDto {
  name?: string;
  email?: string;
  roleType?: Role;
}
