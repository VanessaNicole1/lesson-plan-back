-- CreateEnum
CREATE TYPE "LessonPlanType" AS ENUM ('NORMAL', 'REMEDIAL');

-- AlterTable
ALTER TABLE "LessonPlan" ADD COLUMN     "trackingSteps" JSONB,
ADD COLUMN     "type" "LessonPlanType" NOT NULL DEFAULT 'NORMAL';
