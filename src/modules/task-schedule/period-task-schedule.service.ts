import { Injectable } from "@nestjs/common";
import { SendEmailServiceWrapper } from "../common/services/send-email-wrapper.service";
import { CronService } from "../common/services/cron.service";
import { PeriodsService } from "../periods/periods.service";
import { Cron } from "@nestjs/schedule";
import { convertToSpanishDate } from "src/utils/date.utils";
import { DeactivatePeriodReminderEmail } from "../common/strategies/email/period/deactivate-period-reminder.strategy";
import { DeactivatePeriodEmail } from "../common/strategies/email/period/deactivate-period.strategy";

@Injectable()
export class PeriodTaskScheduleService {

  constructor(
    private emailService: SendEmailServiceWrapper,
    private periodService: PeriodsService) {}

  /**
   * Every day at 8 a.m
   * Notify the manager that the period will be deactivated as the end of the period is close to the end of the period.
   */
  @CronService.ProdCron('0 8 * * 1-5')
  async deactivatePeriodNotification() {
    const activePeriods = await this.periodService.getPeriodsToNotify();
    for (const activePeriod of activePeriods) {
      const { periodDisplayName, managerName, endDate, managerEmail } = activePeriod;
      const convertedEndDate = convertToSpanishDate(endDate);
      const deactivatePeriodEmail = new DeactivatePeriodReminderEmail(periodDisplayName, managerName, convertedEndDate);
      this.emailService.sendEmail(deactivatePeriodEmail, managerEmail);
    }
  }

  /**
   * Every day at 18 p.m
   * Deactivate the process for the current period when the end date expires.
   */
  @Cron('0 18 * * 1-5')
  async deactivatePeriodAction() {
    const activePeriods = await this.periodService.getPeriodToDeactivate();
    for (const period of activePeriods) {
      const { periodId, periodDisplayName, managerName, managerEmail, endDate } = period;
      await this.periodService.deactivatePeriod(periodId);
      const convertedEndDate = convertToSpanishDate(endDate);
      const deactivatePeriodEmail = new DeactivatePeriodEmail(periodDisplayName, managerName, convertedEndDate);
      this.emailService.sendEmail(deactivatePeriodEmail, managerEmail);
    }
  }
}