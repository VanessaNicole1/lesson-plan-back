/*
  Warnings:

  - Added the required column `periodId` to the `Grade` table without a default value. This is not possible if the table is not empty.
  - Added the required column `periodId` to the `LessonPlan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `periodId` to the `Manager` table without a default value. This is not possible if the table is not empty.
  - Added the required column `periodId` to the `Schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `periodId` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `periodId` to the `Subject` table without a default value. This is not possible if the table is not empty.
  - Added the required column `periodId` to the `Teacher` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Grade" ADD COLUMN     "periodId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "LessonPlan" ADD COLUMN     "periodId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Manager" ADD COLUMN     "periodId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Schedule" ADD COLUMN     "periodId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "periodId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Subject" ADD COLUMN     "periodId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Teacher" ADD COLUMN     "periodId" TEXT NOT NULL;
