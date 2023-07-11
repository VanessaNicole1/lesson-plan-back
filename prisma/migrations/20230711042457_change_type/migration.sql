/*
  Warnings:

  - The `resources` column on the `LessonPlan` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "LessonPlan" DROP COLUMN "resources",
ADD COLUMN     "resources" JSONB;
