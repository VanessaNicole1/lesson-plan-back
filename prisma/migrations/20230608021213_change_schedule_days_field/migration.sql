/*
  Warnings:

  - You are about to drop the column `days` on the `Schedule` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Schedule" DROP COLUMN "days",
ADD COLUMN     "metadata" JSONB;
