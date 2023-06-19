/*
  Warnings:

  - You are about to drop the column `day` on the `Schedule` table. All the data in the column will be lost.
  - You are about to drop the column `endHour` on the `Schedule` table. All the data in the column will be lost.
  - You are about to drop the column `startHour` on the `Schedule` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Schedule" DROP COLUMN "day",
DROP COLUMN "endHour",
DROP COLUMN "startHour",
ADD COLUMN     "days" JSONB;
