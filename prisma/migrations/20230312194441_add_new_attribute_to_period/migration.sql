/*
  Warnings:

  - Added the required column `displayName` to the `Period` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Period" ADD COLUMN     "displayName" TEXT NOT NULL;
