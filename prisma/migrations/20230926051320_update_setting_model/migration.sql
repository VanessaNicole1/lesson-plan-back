/*
  Warnings:

  - Changed the type of `host` on the `Setting` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `port` on the `Setting` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Setting" DROP COLUMN "host",
ADD COLUMN     "host" INTEGER NOT NULL,
DROP COLUMN "port",
ADD COLUMN     "port" INTEGER NOT NULL;
