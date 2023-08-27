import { RemedialLessonPlanStepReportRole } from "../enums/remedial-lesson-plan-step-report-role.enum";

export interface RemedialReport {
  name: string,
  url: string,
  createdDate: Date,
  size: number,
  role: RemedialLessonPlanStepReportRole
  signedBy: string
}
