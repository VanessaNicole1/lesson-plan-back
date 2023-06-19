/*
  Warnings:

  - A unique constraint covering the columns `[teacherId]` on the table `TeacherEventsConfig` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `teacherId` to the `TeacherEventsConfig` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TeacherEventsConfig" ADD COLUMN     "teacherId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "TeacherEventsConfig_teacherId_key" ON "TeacherEventsConfig"("teacherId");

-- AddForeignKey
ALTER TABLE "TeacherEventsConfig" ADD CONSTRAINT "TeacherEventsConfig_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
