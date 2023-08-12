import { Injectable } from '@nestjs/common';
import { TeachersService } from '../teachers/teachers.service';
import { TeacherScheduleNotFilledEmail } from '../common/strategies/email/teacher/schedule-not-filled.strategy';
import { PeriodsService } from '../periods/periods.service';
import { TeacherAD2NotFilledEmail } from '../common/strategies/email/teacher/ad2-not-filled.strategy';
import { TeacherNotLessonPlanForAWeekEmail } from '../common/strategies/email/teacher/not-lesson-plan-for-a-week.strategy';
import { TeacherMissingStudentsToValidateLessonPlanEmail } from '../common/strategies/email/teacher/missing-students-to-graded-lp.strategy';
import { CronService } from '../common/services/cron.service';
import { hasPassedAmountOfDays } from 'src/utils/date.utils';
import { SendEmailServiceWrapper } from '../common/services/send-email-wrapper.service';

@Injectable()
export class TeacherTaskScheduleService {

  constructor(
    private teacherService: TeachersService,
    private periodService: PeriodsService,
    private emailService: SendEmailServiceWrapper
  ) {}
  
  /**
   * Cron job executed every dat at 8m after 3 days of period creation.
   */
  @CronService.ProdCron('0 8 * * *')
  async teacherScheduleNotFilledNotification() {
    const teachersWithEmptySchedulesConfig = await this.teacherService.findTeachersWithEmptySchedulesConfigInActivePeriods();

    for (const teacher of teachersWithEmptySchedulesConfig) {
      const { user, schedules, periodId } = teacher;
      const period = await this.periodService.findOne(periodId);
      
      const hasPassed3Days = hasPassedAmountOfDays(period.createdAt, 3, 8);

      if (schedules.length > 0 && hasPassed3Days) {
        const scheduleNotFilledEmail = new TeacherScheduleNotFilledEmail(period.displayName, user.displayName, schedules);
        this.emailService.sendEmail(scheduleNotFilledEmail, user.email);
      }
    }
  }

  /**
   * Cron job executed every dat at 8m after 3 days of period creation.
   */
  @CronService.ProdCron('0 8 * * *')
  async teacherAD2NotFilledNotification() {
    const teachersWithEmptyAD2OrCustomNotification = await this.teacherService.findTeachersWithEmptyAD2OrCustomNotificationsInActivePeriods();
    const notificationWays = 2;

    for (const teacher of teachersWithEmptyAD2OrCustomNotification) {
      const { user, periodId, eventsConfig } = teacher;
      const period = await this.periodService.findOne(periodId);

      const hasPassed3Days = hasPassedAmountOfDays(period.createdAt, 3, 8);

      if (eventsConfig.length === notificationWays && hasPassed3Days) {
        const ad2NotFilledEmail = new TeacherAD2NotFilledEmail(period.displayName, user.displayName);
        this.emailService.sendEmail(ad2NotFilledEmail, user.email);
      }
    }
  }


  /**
   * Every Monday at 8am.
   */
  @CronService.ProdCron("0 8 * * 1")
  async teacherNotLessonPlanForAWeekNotification() {


    const notLessonPlanForAWeekEmail = new TeacherNotLessonPlanForAWeekEmail('', '');
    this.emailService.sendEmail(notLessonPlanForAWeekEmail, 'email')
  }

  
  // Every day 
  async teacherMissingStudentsToGradedLessonPlanNotification() {
    const missingStudentsToGradedLessonPlanEmail = new TeacherMissingStudentsToValidateLessonPlanEmail(
      '',
      '',
      '',
      [],
      '',
      ''
    );
    this.emailService.sendEmail(missingStudentsToGradedLessonPlanEmail, 'email');
  }
}
