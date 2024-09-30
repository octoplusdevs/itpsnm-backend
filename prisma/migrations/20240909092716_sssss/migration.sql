/*
  Warnings:

  - You are about to drop the `accessLogs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "accessLogs" DROP CONSTRAINT "accessLogs_userId_fkey";

-- DropTable
DROP TABLE "accessLogs";

-- CreateTable
CREATE TABLE "accesslogs" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "AccessStatus" NOT NULL,

    CONSTRAINT "accesslogs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "accesslogs" ADD CONSTRAINT "accesslogs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
