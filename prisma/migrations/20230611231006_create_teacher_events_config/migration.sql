-- CreateTable
CREATE TABLE "TeacherEventsConfig" (
    "id" TEXT NOT NULL,
    "eventName" TEXT NOT NULL,
    "metadata" JSONB,

    CONSTRAINT "TeacherEventsConfig_pkey" PRIMARY KEY ("id")
);
