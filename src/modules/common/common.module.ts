import { Global, Module } from '@nestjs/common';
import { PrismaService } from './services/prisma.service';
import { SendEmailService } from './services/send-email.service';
import { SendFakeEmailService } from './services/send-fake-email.service';

@Global()
@Module({
  providers: [PrismaService, SendEmailService, SendFakeEmailService],
  exports: [PrismaService, SendEmailService, SendFakeEmailService]
})
export class CommonModule {}
