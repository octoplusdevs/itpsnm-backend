/*
  Warnings:

  - The `status` column on the `Notification` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('NEW', 'UNSEEN', 'SEEN', 'CONFIRMED');

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "status",
ADD COLUMN     "status" "NotificationStatus" NOT NULL DEFAULT 'NEW';
