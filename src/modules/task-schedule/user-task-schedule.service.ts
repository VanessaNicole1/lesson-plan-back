import { Cron } from "@nestjs/schedule";
import { UsersService } from "../users/users.service";
import { CronService } from "../common/services/cron.service";
import { Injectable } from "@nestjs/common";
import { PeriodsService } from "../periods/periods.service";

@Injectable()
export class UserTaskScheduleService {
  constructor(
    private userService: UsersService,
    private periodService: PeriodsService,
  ) {}

  /**
   * Notify the user that he/she must register in the system.
   * After 3 days of starting the process.
   */
  // @Cron('*/10 * * * * *')
  async userUnregisteredNotification() {
    const unregisteredUsers = await this.userService.findUnregisteredUsers();
  }


}