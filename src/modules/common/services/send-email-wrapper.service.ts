// @ts-nocheck
import { Injectable } from "@nestjs/common";
import { SendEmailService } from "./send-email.service";
import { SendFakeEmailService } from "./send-fake-email.service";
import { EmailSender } from "./email-sender.interface";
import { EmailStrategy } from "../interfaces/email/email-strategy.interface";

@Injectable()
export class SendEmailServiceWrapper implements EmailSender {
  constructor(
    private sendEmailService: SendEmailService,
    private sendFakeEmailService: SendFakeEmailService
  ) {}

  getEmailService() : EmailSender {
    const isProd = process.env.ENV.toUpperCase() === 'PROD';
    return isProd ? this.sendEmailService : this.sendFakeEmailService;
  }
  
  sendEmail(emailStrategy: EmailStrategy, receiver: string): void {
    const emailService = this.getEmailService();
    emailService.sendEmail(emailStrategy, receiver);
  }
}
