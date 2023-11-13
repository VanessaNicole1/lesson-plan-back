// @ts-nocheck
import { Injectable } from "@nestjs/common";
import { EmailStrategy } from "../interfaces/email/email-strategy.interface";
import { SendEmail } from "../context/email/send-email.context";
import { EmailSender } from "./email-sender.interface";
import { EmailService } from "../../email/email.service";

@Injectable()
export class SendEmailService implements EmailSender {
  constructor(private emailService: EmailService) {}

  async sendEmail(emailStrategy: EmailStrategy, receiver: string) {
    const emailSettings = await this.emailService.find();
    const sendEmailContext = new SendEmail(emailStrategy);
    sendEmailContext.sendEmail(receiver, {
      ...emailSettings,
      account: emailSettings.user
    });
  }
}
