import { Injectable } from '@nestjs/common';
import { UpdateRegisterConfigDto } from './dto/update-register-config.dto';
import { RegisterConfigRepository } from './register-config.repository';

@Injectable()
export class RegisterConfigService {

  constructor(private registerConfigRepository: RegisterConfigRepository) {}

  update(registeredToken: string, updateRegisterConfigDto: UpdateRegisterConfigDto) {
    return this.registerConfigRepository.updateRegisterToken(registeredToken, updateRegisterConfigDto);
  };
}
