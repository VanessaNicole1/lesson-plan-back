import { Module } from '@nestjs/common';
import { RegisterConfigService } from './register-config.service';
import { RegisterConfigController } from './register-config.controller';
import { RegisterConfigRepository } from './register-config.repository';

@Module({
  controllers: [RegisterConfigController],
  providers: [RegisterConfigService, RegisterConfigRepository]
})
export class RegisterConfigModule {}
