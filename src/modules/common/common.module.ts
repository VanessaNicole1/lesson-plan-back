import { Global, Module } from '@nestjs/common';
import { PrismaService } from './services/prisma.service';
import { SendEmailService } from './services/send-email.service';
import { SendFakeEmailService } from './services/send-fake-email.service';
import { ReportsService } from './services/reports.service';

@Global()
@Module({
  providers: [PrismaService, SendEmailService, SendFakeEmailService, ReportsService],
  exports: [PrismaService, SendEmailService, SendFakeEmailService, ReportsService]
})
export class CommonModule {}
