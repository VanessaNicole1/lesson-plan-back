/*
  Warnings:

  - You are about to drop the `NumberStudentGraded` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "NumberStudentGraded";

-- CreateTable
CREATE TABLE "MinimumStudents" (
    "id" TEXT NOT NULL,
    "minimumNumber" INTEGER NOT NULL,

    CONSTRAINT "MinimumStudents_pkey" PRIMARY KEY ("id")
);
