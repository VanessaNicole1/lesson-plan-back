import { Global, Module } from '@nestjs/common';
import { PrismaService } from './services/prisma.service';
import { SendEmailService } from './services/send-email.service';

@Global()
@Module({
  providers: [PrismaService, SendEmailService],
  exports: [PrismaService, SendEmailService]
})
export class CommonModule {}
