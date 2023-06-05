/*
  Warnings:

  - You are about to drop the `MinimumStudents` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "MinimumStudents";

-- CreateTable
CREATE TABLE "MinimumStudentsToEvaluate" (
    "id" TEXT NOT NULL,
    "minimumNumber" INTEGER NOT NULL,

    CONSTRAINT "MinimumStudentsToEvaluate_pkey" PRIMARY KEY ("id")
);
