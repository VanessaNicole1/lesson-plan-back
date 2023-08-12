import { Cron } from "@nestjs/schedule";

export class CronService {

  private static isProd: boolean = process.env.ENV.toUpperCase() === 'PROD';

  static ProdCron(cronTime) {
    return CronService.isProd ? Cron(cronTime) : () => {};
  }

  static DevCron(cronTime) {
    return !CronService.isProd ? Cron(cronTime): () => {};
  }
}
