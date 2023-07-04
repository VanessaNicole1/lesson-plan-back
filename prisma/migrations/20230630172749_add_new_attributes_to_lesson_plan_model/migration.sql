-- AlterTable
ALTER TABLE "LessonPlan" ADD COLUMN     "bibliography" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "purposeOfClass" TEXT,
ALTER COLUMN "content" SET DATA TYPE TEXT;
