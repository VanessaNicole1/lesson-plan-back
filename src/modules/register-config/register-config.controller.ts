import { Controller, Body, Patch, Param } from '@nestjs/common';
import { RegisterConfigService } from './register-config.service';
import { UpdateRegisterConfigDto } from './dto/update-register-config.dto';

@Controller('register-config')
export class RegisterConfigController {
  constructor(private readonly registerConfigService: RegisterConfigService) {}

  @Patch('update-registered-token/:registeredToken')
  update(
    @Param('registeredToken') registeredToken: string,
    @Body() updateRegisterConfigDto: UpdateRegisterConfigDto
  ) {
    return this.registerConfigService.update(registeredToken, updateRegisterConfigDto);
  }
}
