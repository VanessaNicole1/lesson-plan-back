-- CreateTable
CREATE TABLE "PeriodConfig" (
    "id" TEXT NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "minimumStudentsToEvaluate" INTEGER NOT NULL,
    "periodId" TEXT NOT NULL,

    CONSTRAINT "PeriodConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PeriodConfig_periodId_key" ON "PeriodConfig"("periodId");

-- AddForeignKey
ALTER TABLE "PeriodConfig" ADD CONSTRAINT "PeriodConfig_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "Period"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
