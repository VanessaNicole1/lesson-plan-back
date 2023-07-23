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
  
  
  @CronService.ProdCron('0 8 * * *') // Every day at 8am, after 3 days of period creation
  @CronService.DevCron('*/10 * * * * *')
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

  // Every day at 8 AM, after 3 days of period creation.
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

  // Every Friday at 8 AM.
  async teacherNotLessonPlanForAWeekNotification() {
    // TODO: Do not forget to put all the necessary logic here!
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
