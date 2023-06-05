/*
  Warnings:

  - You are about to drop the column `numberStudent` on the `NumberStudentGraded` table. All the data in the column will be lost.
  - Added the required column `numberStudents` to the `NumberStudentGraded` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "NumberStudentGraded" DROP COLUMN "numberStudent",
ADD COLUMN     "numberStudents" INTEGER NOT NULL;
