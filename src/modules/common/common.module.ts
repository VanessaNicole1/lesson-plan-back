import { Global, Module } from '@nestjs/common';
import { PrismaService } from './services/prisma.service';
import { SendEmailService } from './services/send-email.service';
import { SendFakeEmailService } from './services/send-fake-email.service';
import { ReportsService } from './services/reports.service';
import { SendEmailServiceWrapper } from './services/send-email-wrapper.service';
import { DigitalSignService } from './services/digital-sign.service';
import { EmailModule } from '../email/email.module';

@Global()
@Module({
  imports: [
    EmailModule
  ],
  providers: [
    PrismaService,
    SendEmailService,
    SendFakeEmailService,
    ReportsService,
    SendEmailServiceWrapper,
    DigitalSignService
  ],
  exports: [
    PrismaService,
    SendEmailService,
    SendFakeEmailService,
    ReportsService,
    SendEmailServiceWrapper,
    DigitalSignService
  ],
})
export class CommonModule {}
