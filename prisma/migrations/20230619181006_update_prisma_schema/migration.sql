/*
  Warnings:

  - You are about to drop the column `idPeriod` on the `Subject` table. All the data in the column will be lost.
  - Added the required column `day` to the `Schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endHour` to the `Schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startHour` to the `Schedule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Schedule" ADD COLUMN     "day" TEXT NOT NULL,
ADD COLUMN     "endHour" TEXT NOT NULL,
ADD COLUMN     "startHour" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Subject" DROP COLUMN "idPeriod";
