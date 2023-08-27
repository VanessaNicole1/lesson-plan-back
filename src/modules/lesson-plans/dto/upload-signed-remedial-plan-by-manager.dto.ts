import { IsArray, IsDate, IsUUID } from 'class-validator';

export class UploadSignedRemedialPlanByManagerDTO {
  @IsUUID()
  remedialPlanId: string;

  @IsArray()
  remedialReports: any[];

  @IsArray()
  trackingSteps: any[];

  @IsDate()
  deadline: Date;
}
