-- CreateTable
CREATE TABLE "RegisterConfig" (
    "id" TEXT NOT NULL,
    "registerToken" TEXT,
    "isRegistered" BOOLEAN DEFAULT false,
    "userId" TEXT NOT NULL,

    CONSTRAINT "RegisterConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RegisterConfig_registerToken_key" ON "RegisterConfig"("registerToken");

-- CreateIndex
CREATE UNIQUE INDEX "RegisterConfig_userId_key" ON "RegisterConfig"("userId");

-- AddForeignKey
ALTER TABLE "RegisterConfig" ADD CONSTRAINT "RegisterConfig_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
