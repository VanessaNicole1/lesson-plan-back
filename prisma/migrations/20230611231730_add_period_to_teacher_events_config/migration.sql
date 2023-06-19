/*
  Warnings:

  - Added the required column `periodId` to the `TeacherEventsConfig` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TeacherEventsConfig" ADD COLUMN     "periodId" TEXT NOT NULL;
