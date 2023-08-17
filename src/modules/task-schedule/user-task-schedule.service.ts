import { Cron } from "@nestjs/schedule";
import { UsersService } from "../users/users.service";
import { CronService } from "../common/services/cron.service";
import { Injectable } from "@nestjs/common";
import { PeriodsService } from "../periods/periods.service";
import { convertToSpanishDate, hasPassedAmountOfDays } from "src/utils/date.utils";
import { UnregisteredUserEmail } from "../common/strategies/email/user/unregistered-user.strategy";
import { SendEmailServiceWrapper } from "../common/services/send-email-wrapper.service";

@Injectable()
export class UserTaskScheduleService {
  constructor(
    private userService: UsersService,
    private periodService: PeriodsService,
    private emailService: SendEmailServiceWrapper,
  ) {}

  /**
   * Notify the user that he/she must register in the system.
   * Every day at 8 a.m, after 3 days of starting the process
   */
  // @Cron('*/10 * * * * *')
  // @CronService.ProdCron('*/10 * * * * *')
  @CronService.ProdCron('0 8 * * *')
  async userUnregisteredNotification() {
    const unregisteredUsers = await this.userService.findUnregisteredUsers();
    for (const unregisteredUser of unregisteredUsers) {
      const { displayName, email, registerConfig } = unregisteredUser;
      const { periodId, isRegistered, registerToken } = registerConfig;
      const period = await this.periodService.findOne(periodId);
      const convertedCreatedAt = convertToSpanishDate(period.createdAt);

      const hasPassed3Days = hasPassedAmountOfDays(period.createdAt, 3, 8);

      if (!isRegistered && hasPassed3Days) {
        const unregisteredUserEmail = new UnregisteredUserEmail(registerToken, period.displayName, displayName, convertedCreatedAt);
        this.emailService.sendEmail(unregisteredUserEmail, email);
      }
    }
  }
}