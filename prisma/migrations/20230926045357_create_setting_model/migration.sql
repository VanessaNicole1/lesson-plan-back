-- CreateTable
CREATE TABLE "Setting" (
    "id" TEXT NOT NULL,
    "host" TEXT NOT NULL,
    "port" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "sender" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Setting_pkey" PRIMARY KEY ("id")
);
