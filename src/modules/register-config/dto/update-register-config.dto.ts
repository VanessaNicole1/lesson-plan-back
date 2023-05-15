import { IsDefined } from 'class-validator';

export class UpdateRegisterConfigDto {
  registerToken: string

  @IsDefined()
  isRegistered: boolean
}
